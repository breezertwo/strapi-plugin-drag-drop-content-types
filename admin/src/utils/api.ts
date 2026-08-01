import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

  const fetchContentList = async () => {
    const sortIndexParam = new URLSearchParams({ contentType });
    if (locale) {
      sortIndexParam.set('locale', locale);
    }

    const result = await get<GetPageEntriesResponse[]>(
      `/drag-drop-content-types/sort-index?${sortIndexParam.toString()}`
    );

    return result.data || [];
  };

  return useQuery({
    queryKey: ['fetch_content_list', contentType, locale],
    queryFn: fetchContentList,
    enabled,
  });
};

export const useMoveContentItem = (contentType: string, locale?: string) => {
  const { put } = useFetchClient();
  const queryClient = useQueryClient();

  const moveContentItem = async (params: {
    id: number;
    newIndex: number;
    optimisticData: GetPageEntriesResponse[];
  }) => {
    await put('/drag-drop-content-types/move', {
      contentType,
      id: params.id,
      newIndex: params.newIndex,
      locale,
    });
  };

  return useMutation({
    mutationFn: moveContentItem,
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['fetch_content_list', contentType, locale] });
      const previousData = queryClient.getQueryData<GetPageEntriesResponse[]>([
        'fetch_content_list',
        contentType,
        locale,
      ]);

      queryClient.setQueryData(['fetch_content_list', contentType, locale], params.optimisticData);
      return { previousData };
    },
    onError: (_err, _params, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['fetch_content_list', contentType, locale], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch_content_list', contentType, locale] });
    },
  });
};
