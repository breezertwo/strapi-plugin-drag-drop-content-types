import { useMemo } from 'react';
import { OptimisticMoves, type OptimisticMove } from './optimisticMoves';
import { fetchMatchingDocumentIds, serializeMatchingParams } from './filtering';
import { adminApi, useFetchClient, useNotification } from '@strapi/strapi/admin';
import { useDispatch } from 'react-redux';
import {
  QueryClient,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { ContentTypeConfigResponse, GetPageEntriesResponse } from '../components/types';
import type { PluginSettingsResponse } from '../../../server/src/services/settings';
import { useIntl } from 'react-intl';

export const queryClient = new QueryClient();

export const useFetchSettings = (contentType: string, enabled = true, fallback = true) => {
  const { get } = useFetchClient();

  const fetchSettings = async () => {
    const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);

    let fetchedSettings = {
      rank: data.body.rank,
      title: data.body.title,
      subtitle: data.body.subtitle?.length > 0 ? data.body.subtitle : null,
      triggerWebhooks: data.body.triggerWebhooks,
    };

    if (fetchedSettings.title.length === 0 && fallback) {
      const { data: contentTypeConfig } = await get<ContentTypeConfigResponse>(
        `/content-manager/content-types/${contentType}/configuration`
      );

      fetchedSettings.title = contentTypeConfig.data.contentType?.settings.mainField;
    }

    return fetchedSettings;
  };

  return useQuery({ queryKey: ['fetch_settings', contentType], queryFn: fetchSettings, enabled });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const { post } = useFetchClient();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const updateSettings = async (update: {
    rank: string;
    title: string;
    subtitle: string | null;
    triggerWebhooks: boolean;
  }) => {
    await post(`/drag-drop-content-types/settings`, {
      body: update,
    });
  };

  return useMutation({
    mutationFn: updateSettings,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch_settings'] });
    },
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: 'plugin.settings.updated',
          defaultMessage: 'Settings successfully updated',
        }),
      });
    },
  });
};

export const useIsSortable = (contentType: string) => {
  const { get } = useFetchClient();

  const fetchIsSortable = async () => {
    const { data } = await get<{ sortable: boolean }>(
      `/drag-drop-content-types/sortable?contentType=${encodeURIComponent(contentType)}`
    );

    return data.sortable;
  };

  return useQuery({
    queryKey: ['is_sortable', contentType],
    queryFn: fetchIsSortable,
    enabled: !!contentType,
    // Sortability only depends on the schema, which cannot change without a restart.
    staleTime: Infinity,
  });
};

export const useFetchContentList = (contentType: string, locale?: string, enabled = true) => {
  const { get } = useFetchClient();
  const isMoving = useIsMutating({ mutationKey: ['move_content_item', contentType] }) > 0;

  const fetchContentList = async ({ signal }: { signal: AbortSignal }) => {
    const sortIndexParam = new URLSearchParams({ contentType });
    if (locale) {
      sortIndexParam.set('locale', locale);
    }

    const result = await get<GetPageEntriesResponse[]>(
      `/drag-drop-content-types/sort-index?${sortIndexParam.toString()}`,
      { signal }
    );

    return result.data || [];
  };

  return useQuery({
    queryKey: ['fetch_content_list', contentType, locale],
    queryFn: fetchContentList,
    enabled: enabled && !isMoving,
  });
};

export const useMatchingDocuments = (
  contentType: string,
  params: Record<string, unknown>,
  enabled: boolean
) => {
  const { get } = useFetchClient();
  const isMoving = useIsMutating({ mutationKey: ['move_content_item', contentType] }) > 0;
  return useQuery({
    queryKey: ['matching_documents', contentType, params],
    enabled: enabled && !isMoving,
    queryFn: ({ signal }) =>
      fetchMatchingDocumentIds(async (page) => {
        const { data } = await get<{
          results: { documentId: string }[];
          pagination: { pageCount: number };
        }>(
          `/content-manager/collection-types/${encodeURIComponent(contentType)}?${serializeMatchingParams(
            {
              ...params,
              page,
              sort: 'documentId:asc',
            }
          )}`,
          {
            signal,
          }
        );
        return data;
      }),
  });
};

export const useMoveContentItem = (contentType: string, locale?: string) => {
  const { put } = useFetchClient();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const moves = useMemo(() => new OptimisticMoves(), [queryClient, contentType, locale]);
  const queryKey = ['fetch_content_list', contentType, locale];
  const mutationKey = ['move_content_item', contentType];

  const moveContentItem = async (params: OptimisticMove) => {
    await put('/drag-drop-content-types/move', {
      contentType,
      id: params.id,
      newIndex: params.newIndex,
      position: params.position,
      target: params.target,
      locale,
    });
  };

  return useMutation({
    mutationKey,
    // onMutate still runs immediately for queued mutations; only the requests are serialized.
    scope: { id: `move_content_item:${contentType}` },
    mutationFn: moveContentItem,
    onMutate: async (params) => {
      const canceled = Promise.all([
        queryClient.cancelQueries({ queryKey: ['fetch_content_list', contentType] }),
        queryClient.cancelQueries({ queryKey: ['matching_documents', contentType] }),
      ]);
      const current = queryClient.getQueryData<GetPageEntriesResponse[]>(queryKey) ?? [];
      queryClient.setQueryData(queryKey, moves.add(params, current));
      await canceled;
    },
    onSuccess: (_data, params) => {
      moves.settle(params, true);
    },
    onError: (_err, params) => {
      queryClient.setQueryData(queryKey, moves.settle(params, false));
    },
    onSettled: async () => {
      // Intermediate responses must not refetch over newer optimistic moves.
      if (queryClient.isMutating({ mutationKey }) > 1) return;
      dispatch(
        adminApi.util.invalidateTags([{ type: 'Document' as any, id: `${contentType}_LIST` }])
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['fetch_content_list', contentType] }),
        queryClient.invalidateQueries({ queryKey: ['matching_documents', contentType] }),
      ]);
    },
  });
};
