import { arrayMoveImmutable } from 'array-move';
import {
  useNotification,
  useAPIErrorHandler,
  isFetchError,
  unstable_useContentManagerContext,
} from '@strapi/strapi/admin';
import { useQueryParams } from '../../utils/useQueryParams';
import type { SortModalStatus, UpdateContentRanksParams } from '../types';
import { SortModal } from './SortModal';
import {
  useMoveContentItem,
  useFetchContentList,
  useFetchSettings,
  useIsSortable,
} from '../../utils/api';
import { useCallback, useState } from 'react';

const FALLBACK_SETTINGS = { rank: '', title: '', subtitle: null };

export const SortModalLogicWrapper = () => {
  const { queryParams } = useQueryParams();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const { model: contentType } = unstable_useContentManagerContext();
  const locale = queryParams.get('plugins[i18n][locale]') ?? undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: moveContentItem } = useMoveContentItem(contentType, locale);
  const { data: isSortable } = useIsSortable(contentType);
  const { data: settingsData, isLoading: isSettingsLoading } = useFetchSettings(
    contentType,
    isModalOpen
  );
  const { data: contentListData, isLoading: contentListLoading } = useFetchContentList(
    contentType,
    locale,
    isModalOpen
  );

  const updateContentRanks = useCallback(
    (item: UpdateContentRanksParams) => {
      const { oldIndex, newIndex, position } = item;

      if (oldIndex === newIndex || !contentListData || !settingsData) return;

      const movedItem = contentListData[oldIndex];
      if (!movedItem) return;

      moveContentItem(
        {
          id: movedItem.id,
          newIndex,
          position,
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
    },
    [contentListData, settingsData, moveContentItem, toggleNotification, formatAPIError]
  );

  const getStatus = (): SortModalStatus => {
    if (!isSortable) {
      return 'unavailable';
    } else if (!isModalOpen || contentListLoading || isSettingsLoading) {
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
      onOpenChange={setIsModalOpen}
      settings={settingsData ?? FALLBACK_SETTINGS}
    />
  );
};
