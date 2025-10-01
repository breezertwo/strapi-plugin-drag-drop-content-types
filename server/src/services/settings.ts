import type { Core } from '@strapi/strapi';

export interface PluginSettingsBody {
  rank: string;
  title: string;
  subtitle: string;
  triggerWebhooks: boolean;
}

export interface PluginSettingsResponse {
  body: PluginSettingsBody;
}

const getPluginStore = () => {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'drag-drop-content-types',
  });
};

const createDefaultConfig = async () => {
  const pluginStore = getPluginStore();
  const value: PluginSettingsResponse = {
    body: {
      rank: 'rank',
      title: '',
      subtitle: '',
      triggerWebhooks: false,
    },
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
};

export default () => ({
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }

    return config;
  },

  async setSettings(settings: PluginSettingsResponse) {
    const value = settings;
    const pluginStore = getPluginStore();

    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  },
});
