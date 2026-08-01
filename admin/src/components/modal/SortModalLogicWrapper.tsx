import { arrayMoveImmutable } from 'array-move';
import { useNotification, useAPIErrorHandler, isFetchError } from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type { UpdateContentRanksParams } from '../types';
import { SortModal } from './SortModal';
import { useMoveContentItem, useFetchContentList, useFetchSettings } from '../../utils/api';
import { useState } from 'react';

export const SortModalLogicWrapper = () => {
  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const paths = window.location.pathname.split('/');
  const contentType = paths[paths.length - 1];
  const locale = queryParams?.['plugins[i18n][locale]'];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: moveContentItem } = useMoveContentItem(contentType, locale);
  const { data: settingsData, isLoading: isSettingsLoading } = useFetchSettings(
    contentType,
    isModalOpen
  );
  const { data: contentListData, isLoading: contentListLoading } = useFetchContentList(
    contentType,
    locale
  );

  const updateContentRanks = async (item: UpdateContentRanksParams) => {
    const { oldIndex, newIndex } = item;

    if (oldIndex === newIndex || !contentListData || !settingsData) return;

    const movedItem = contentListData[oldIndex];
    if (!movedItem) return;

    moveContentItem(
      {
        id: movedItem.id,
        newIndex,
        optimisticData: arrayMoveImmutable(contentListData, oldIndex, newIndex),
      },
      {
        onError: (e) => {
          console.error('[drag-drop-content-types]: Could not update content type');
          console.error(e);

          toggleNotification({
            type: 'danger',
            message: isFetchError(e)
              ? formatAPIError(e)
              : 'Failed to update order. Changes have been reverted.',
          });
        },
      }
    );
  };

  const getStatus = () => {
    if (contentListLoading || isSettingsLoading) {
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
