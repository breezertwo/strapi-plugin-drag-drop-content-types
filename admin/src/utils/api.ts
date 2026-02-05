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

export const useFetchContentList = (contentType: string, locale?: string) => {
  const { get } = useFetchClient();

  const fetchContentList = async () => {
    if (!locale) return [];

    const sortIndexParam = new URLSearchParams({
      contentType,
      locale,
    });

    const result = await get<GetPageEntriesResponse[]>(
      `/drag-drop-content-types/sort-index?${sortIndexParam.toString()}`
    );

    return result.data || [];
  };

  return useQuery({
    queryKey: ['fetch_content_list', contentType, locale],
    queryFn: fetchContentList,
    enabled: !!locale,
  });
};

export const useBatchUpdateContentList = (contentType: string) => {
  const { put } = useFetchClient();
  const queryClient = useQueryClient();

  const batchUpdateContentList = async (
    updates: {
      id: number;
      rank: number;
    }[]
  ) => {
    await put('/drag-drop-content-types/batch-update', {
      contentType,
      updates,
    });
  };

  return useMutation({
    mutationFn: batchUpdateContentList,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch_content_list', contentType] });
    },
  });
};
