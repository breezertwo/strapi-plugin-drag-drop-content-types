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

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }

    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const cm = strapi.plugin('content-manager').service('content-types');

    console.log('Settings:', JSON.stringify(cm, null, 2));
    return config;
  },

  async setSettings(settings: PluginSettingsResponse) {
    const value = settings;
    const pluginStore = getPluginStore();

    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  },
});
