import { arrayMoveImmutable } from 'array-move';
import { useEffect, useState } from 'react';
import {
  useFetchClient,
  useNotification,
  useAPIErrorHandler,
  FetchError,
  isFetchError,
  adminApi,
} from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type {
  ContentTypeConfigResponse,
  FetchedSettings,
  GetPageEntriesResponse,
  QueryParams,
  UpdateContentRanksParams,
} from './types';
import SortMenu from './SortMenu';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useBatchUpdateContentList, useFetchContentList, useFetchSettings } from '../../utils/api';

const SortModalButton = () => {
  const { put } = useFetchClient();

  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const paths = window.location.pathname.split('/');
  const contentType = paths[paths.length - 1];

  const params = queryParams as unknown as QueryParams;
  const locale = params?.['plugins[i18n][locale]'];

  const { mutate: batchUpdateContentList, isPending } = useBatchUpdateContentList(contentType);
  const { data: settingsData, isLoading: settingsLoading } = useFetchSettings(contentType);
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
    <SortMenu
      data={contentListData || []}
      status={getStatus()}
      onSortEnd={updateContentRanks}
      settings={
        settingsData || {
          rank: '',
          title: '',
          subtitle: null,
        }
      }
    />
  );
};

const queryClient = new QueryClient();

const SortModalElement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SortModalButton />
    </QueryClientProvider>
  );
};

export default SortModalElement;
