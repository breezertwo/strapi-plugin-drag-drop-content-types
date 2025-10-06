import { arrayMoveImmutable } from 'array-move';
import {
  useNotification,
  useAPIErrorHandler,
  FetchError,
  isFetchError,
} from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type {
  ContentTypeConfigResponse,
  FetchedSettings,
  GetPageEntriesResponse,
  QueryParams,
  UpdateContentRanksParams,
} from '../types';
import { SortModal } from './SortModal';
import { useBatchUpdateContentList, useFetchContentList, useFetchSettings } from '../../utils/api';
import { useState } from 'react';

export const SortModalLogicWrapper = () => {
  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const paths = window.location.pathname.split('/');
  const contentType = paths[paths.length - 1];
  const locale = queryParams?.['plugins[i18n][locale]'];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: batchUpdateContentList, isPending } = useBatchUpdateContentList(contentType);
  const { data: settingsData, isLoading: settingsLoading } = useFetchSettings(
    contentType,
    isModalOpen
  );
  const {
    data: contentListData,
    isLoading: contentListLoading,
    isFetching,
  } = useFetchContentList(contentType, locale);

  const updateContentRanks = async (item: UpdateContentRanksParams) => {
    const { oldIndex, newIndex } = item;

    if (oldIndex === newIndex || !contentListData || !settingsData) return;

    if (isPending || isFetching) {
      return toggleNotification({
        type: 'warning',
        message: 'List update pending. Please wait...',
      });
    }

    try {
      const sortedList = arrayMoveImmutable(contentListData, oldIndex, newIndex);

      const rankUpdates = [];
      let rankHasChanged = false;

      for (let i = 0; i < sortedList.length; i++) {
        const newRank = i;

        if (sortedList[i].id != contentListData[i].id) {
          rankUpdates.push({
            id: sortedList[i].id,
            rank: newRank,
          });

          rankHasChanged = true;
        } else if (rankHasChanged) {
          break;
        }
      }

      batchUpdateContentList(rankUpdates);
    } catch (e: any) {
      console.error('[drag-drop-content-types]: Could not update content type');
      console.error(e);

      toggleNotification({
        type: 'danger',
        message: isFetchError(e) ? formatAPIError(e) : 'An error occurred. See console for details',
      });
    }
  };

  const getStatus = () => {
    if (contentListLoading || settingsLoading) {
      return 'loading';
    } else if (contentListData && contentListData.length > 0) {
      return 'success';
    } else {
      return 'empty';
    }
  };

  return (
    <SortModal
      data={contentListData ?? []}
      status={getStatus()}
      onSortEnd={updateContentRanks}
      onOpenChange={(open: boolean) => setIsModalOpen(open)}
      settings={
        settingsData ?? {
          rank: '',
          title: '',
          subtitle: null,
        }
      }
    />
  );
};
