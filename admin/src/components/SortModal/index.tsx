import { arrayMoveImmutable } from 'array-move';
import { useEffect, useState } from 'react';
import { useFetchClient, useNotification, useAPIErrorHandler } from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type {
  ContentTypeConfigResponse,
  FetchedSettings,
  GetPageEntriesResponse,
  QueryParams,
  UpdateContentRanksParams,
} from './types';
import type { PluginSettingsResponse } from '../../../../server/src/services/settings';
import SortMenu from './SortMenu';

const SortModal = () => {
  const { get, put } = useFetchClient();

  const [data, setData] = useState<GetPageEntriesResponse[]>([]);
  const [status, setStatus] = useState('loading');

  const [settings, setSettings] = useState<FetchedSettings>({
    rank: '',
    title: '',
    subtitle: '',
  });

  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const paths = window.location.pathname.split('/');
  const contentType = paths[paths.length - 1];

  const params = queryParams as unknown as QueryParams;
  const locale = params?.['plugins[i18n][locale]'];

  const fetchContentTypeMainField = async () => {
    try {
      const { data } = await get<ContentTypeConfigResponse>(
        `/content-manager/content-types/${contentType}/configuration`
      );
      return data.data.contentType?.settings.mainField;
    } catch (e) {
      console.error(e);
      return 'error: could not get mainField title';
    }
  };

  // Fetch settings from configuration
  const fetchSettings = async () => {
    try {
      const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);

      let fetchedSettings = {
        rank: data.body.rank,
        title: data.body.title,
        subtitle: data.body.subtitle?.length > 0 ? data.body.subtitle : null,
      };

      if (fetchedSettings.title.length === 0) {
        fetchedSettings.title = await fetchContentTypeMainField();
      }

      setSettings(fetchedSettings);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchContentList = async () => {
    try {
      const sortIndexParam = new URLSearchParams({
        contentType,
        locale: locale,
      });

      const result = await get<GetPageEntriesResponse[]>(
        `/drag-drop-content-types/sort-index?${sortIndexParam.toString()}`
      );

      if (result?.data?.length) {
        setData(result.data);
      }

      setStatus('success');
    } catch (e) {
      console.log('Could not fetch content type', e);
      setStatus('error');
    }
  };

  // Update all ranks
  const updateContentRanks = async (item: UpdateContentRanksParams) => {
    const { oldIndex, newIndex } = item;

    if (oldIndex === newIndex) return;

    try {
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

      setData(updatedSortedList);

      await put('/drag-drop-content-types/batch-update', {
        contentType,
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

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.rank) {
      fetchContentList();
    }
  }, [locale, settings?.rank]);

  return (
    <SortMenu
      data={data}
      status={status}
      onOpen={fetchContentList}
      onSortEnd={updateContentRanks}
      settings={settings}
    />
  );
};

export default SortModal;
