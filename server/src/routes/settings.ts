export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'plugin::content-manager.hasPermissions',
            config: { actions: ['plugin::drag-drop-content-types.usage'] },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'settings.setSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'plugin::content-manager.hasPermissions',
            config: { actions: ['plugin::drag-drop-content-types.settings'] },
          },
        ],
      },
    },
  ],
};
