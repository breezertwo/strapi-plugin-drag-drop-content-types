import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import SortModal from './components/SortModal';
import pluginPermissions from './permissions';

export default {
  register(app: any) {
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: 'Drag Drop Content Types',
        },
        permissions: pluginPermissions.main,
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.plugin.configuration`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `${PLUGIN_ID}`,
          Component: () => import('./pages/Settings'),
        },
      ]
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app: any) {
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'sort-component',
      Component: SortModal,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;
    const importedTranslations = await Promise.all(
      (locales as string[]).map(async (locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};

type TradOptions = Record<string, string>;
const prefixPluginTranslations = (trad: TradOptions, pluginId: string): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};
