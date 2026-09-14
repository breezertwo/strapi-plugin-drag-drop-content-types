import {
  useNotification,
  useAPIErrorHandler,
  isFetchError,
  unstable_useContentManagerContext,
  useQueryParams,
} from '@strapi/strapi/admin';
import type { SortModalStatus, UpdateContentRanksParams } from '../types';
import { SortModal } from './SortModal';
import {
  useMoveContentItem,
  useFetchContentList,
  useFetchSettings,
  useIsSortable,
  useMatchingDocuments,
} from '../../utils/api';
import { useCallback, useMemo, useState } from 'react';
import {
  getMatchingParams,
  hasMatchingRestrictions,
  visibleDocuments,
} from '../../utils/filtering';
import { reorderDocuments, type MoveDestination } from '../../../../shared/ordering';

const FALLBACK_SETTINGS = { rank: '', title: '', subtitle: null };

export const SortModalLogicWrapper = () => {
  const [{ query }] = useQueryParams();
  const params = useMemo(() => getMatchingParams(query), [query]);
  const isFiltered = hasMatchingRestrictions(params);
  const locale = typeof params.locale === 'string' ? params.locale : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const { model: contentType } = unstable_useContentManagerContext();

  const { mutateAsync: moveContentItem } = useMoveContentItem(contentType, locale);

  const sortable = useIsSortable(contentType);
  const settings = useFetchSettings(contentType, isModalOpen);
  const fullList = useFetchContentList(contentType, locale, isModalOpen);
  const matches = useMatchingDocuments(contentType, params, isModalOpen && isFiltered);

  const data = useMemo(
    () => visibleDocuments(fullList.data ?? [], isFiltered ? (matches.data ?? []) : undefined),
    [fullList.data, isFiltered, matches.data]
  );
  const busy = !fullList.data || !settings.data || (isFiltered && !matches.data);

  const updateContentRanks = useCallback(
    (item: UpdateContentRanksParams) => {
      if (busy || !fullList.data || !settings.data) return false;

      const movedItem = data[item.oldIndex];
      if (!movedItem || movedItem.isPlaceholder) return false;

      let destination: MoveDestination;
      if (item.position) {
        destination = { position: item.position };
      } else {
        const crossedItem = data[item.newIndex];
        if (item.oldIndex === item.newIndex || !crossedItem) return false;

        // Preserve the existing clamp to the ranked block for unrestricted drag operations.
        if (!isFiltered) destination = { newIndex: item.newIndex };
        else {
          destination = {
            target: {
              documentId: crossedItem.documentId,
              placement: item.newIndex < item.oldIndex ? 'before' : 'after',
            },
          };
        }
      }

      let optimisticData;
      try {
        optimisticData = reorderDocuments(
          fullList.data,
          settings.data.rank,
          movedItem.id,
          destination
        );
      } catch {
        return false;
      }

      void moveContentItem({
        id: movedItem.id,
        rankField: settings.data.rank,
        ...destination,
        optimisticData,
      }).catch((e) => {
        toggleNotification({
          type: 'danger',
          message: isFetchError(e)
            ? formatAPIError(e)
            : 'Failed to update order. Changes have been reverted.',
        });
      });

      return true;
    },
    [
      busy,
      fullList.data,
      settings.data,
      data,
      isFiltered,
      moveContentItem,
      toggleNotification,
      formatAPIError,
    ]
  );

  const hasError =
    sortable.isError || settings.isError || fullList.isError || (isFiltered && matches.isError);

  const getStatus = (): SortModalStatus => {
    if (hasError) return 'error';
    if (sortable.data === false) return 'unavailable';
    if (
      !isModalOpen ||
      busy ||
      sortable.isLoading ||
      settings.isLoading ||
      fullList.isLoading ||
      (isFiltered && matches.isLoading)
    )
      return 'loading';
    return data.length ? 'success' : 'empty';
  };

  return (
    <SortModal
      data={data}
      fullData={fullList.data ?? []}
      isFiltered={isFiltered}
      isLoadingEntries={busy}
      onRetry={() => {
        void sortable.refetch();
        void settings.refetch();
        void fullList.refetch();
        if (isFiltered) void matches.refetch();
      }}
      status={getStatus()}
      onSortEnd={updateContentRanks}
      onOpenChange={setIsModalOpen}
      settings={settings.data ?? FALLBACK_SETTINGS}
    />
  );
};
