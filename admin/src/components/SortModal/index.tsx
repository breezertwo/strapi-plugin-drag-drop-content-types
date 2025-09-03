import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import { useFetchClient, useNotification, useAPIErrorHandler } from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type {
  ContentTypeConfigResponse,
  ContentTypeResponse,
  FetchedSettings,
  GetPageEntriesResponse,
  QueryParams,
  UpdateContentTypeParams,
  MoveDirection,
} from './types';
import type { PluginSettingsResponse } from '../../../../server/src/services/settings';
import SortMenu from './SortMenu';

const SortModal = () => {
  const { get, put } = useFetchClient();

  const [data, setData] = useState<GetPageEntriesResponse[]>([]);
  const [status, setStatus] = useState('loading');
  const [mainField, setMainField] = useState('id');
  const [uid, setUid] = useState<string | null>(null);
  const [settings, setSettings] = useState<FetchedSettings>({
    rank: '',
    title: '',
    subtitle: '',
    mainField: null,
  });

  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  // Get content type from url
  const paths = window.location.pathname.split('/');
  const contentTypePath = paths[paths.length - 1];

  const params = queryParams as unknown as QueryParams;
  const locale = params?.['plugins[i18n][locale]'];

  // Fetch content type config settings
  const fetchContentTypeConfig = async () => {
    // TODO: tie this in with middleware with the request that is already being made on page load
    try {
      const { data } = await get<ContentTypeConfigResponse>(
        `/content-manager/content-types/${contentTypePath}/configuration`
      );
      const settings = data.data.contentType?.settings;
      setMainField(settings.mainField);
      setUid(data.data.contentType?.uid);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch settings from configuration
  const fetchSettings = async () => {
    try {
      const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);
      let fetchedSettings = {
        rank: data.body.rank,
        title: data.body.title?.length > 0 ? data.body.title : mainField,
        subtitle: data.body.subtitle?.length > 0 ? data.body.subtitle : null,
        mainField,
      };
      setSettings(fetchedSettings);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch all entries from the sort controller
  const getAllEntries = async () => {
    const sortIndexParam = new URLSearchParams({
      contentType: contentTypePath,
      locale: locale,
    });

    const results = await get<GetPageEntriesResponse[]>(
      `/drag-drop-content-types/sort-index?${sortIndexParam.toString()}`
    );
    return results;
  };

  // Fetch data from the database
  const fetchContentType = async () => {
    try {
      const entries = await getAllEntries();
      if (entries?.data?.length) {
        setStatus('success');
        setData(entries.data);
      }
    } catch (e) {
      console.log('Could not fetch content type', e);
      setStatus('error');
    }
  };

  // Update all ranks
  const updateContentType = async (item: UpdateContentTypeParams) => {
    const { oldIndex, newIndex } = item;

    if (oldIndex === newIndex) return;

    try {
      // Increase performance by breaking loop after last element having a rank change is updated
      const sortedList = arrayMoveImmutable(data, oldIndex, newIndex);
      const rankUpdates = [];
      let rankHasChanged = false;

      // Create a copy of sortedList to update rank values locally
      const updatedSortedList = [...sortedList];

      // Iterate over all results and append them to the list
      for (let i = 0; i < sortedList.length; i++) {
        const newRank = i;

        // Update the rank in the local copy immediately
        if (settings.rank) {
          updatedSortedList[i] = {
            ...updatedSortedList[i],
            [settings.rank]: newRank,
          };
        }

        // Only update changed values for database
        if (sortedList[i].id != data[i].id) {
          const update = {
            id: sortedList[i].id,
            rank: newRank,
          };
          rankUpdates.push(update);
          rankHasChanged = true;
        } else if (rankHasChanged) {
          break;
        }
      }

      // Set the updated data immediately for UI
      setData(updatedSortedList);

      // Batch Update DB with new ranks
      await put('/drag-drop-content-types/batch-update', {
        contentType: contentTypePath,
        updates: rankUpdates,
      });

      setStatus('success');
    } catch (e: any) {
      console.log('Could not update content type:', e);
      toggleNotification({
        type: 'warning',
        message: formatAPIError(e),
      });
      setStatus('error');
    }
  };

  // Fetch content-type on page render
  useEffect(() => {
    fetchContentTypeConfig();
  }, []);

  // Fetch settings when mainField changes
  useEffect(() => {
    fetchSettings();
  }, [mainField]);

  // Update menu when settings change
  useEffect(() => {
    if (settings?.rank) {
      fetchContentType();
    }
  }, [locale, settings]);

  return (
    // <CheckPermissions permissions={pluginPermissions.main}>
    <SortMenu
      data={data}
      status={status}
      onOpen={fetchContentType}
      onSortEnd={updateContentType}
      settings={settings}
    />
    // </CheckPermissions>
  );
};

export default SortModal;
