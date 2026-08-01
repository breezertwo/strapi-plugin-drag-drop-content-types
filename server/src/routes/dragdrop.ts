export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/sort-index',
      handler: 'dragdrop.sortIndex',
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
      method: 'GET',
      path: '/sortable',
      handler: 'dragdrop.sortable',
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
      method: 'PUT',
      path: '/move',
      handler: 'dragdrop.move',
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
  ],
};
