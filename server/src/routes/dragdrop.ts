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
      method: 'PUT',
      path: '/batch-update',
      handler: 'dragdrop.batchUpdate',
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
