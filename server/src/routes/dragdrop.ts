export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/sort-index',
      handler: 'dragdrop.sortIndex',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'PUT',
      path: '/batch-update',
      handler: 'dragdrop.batchUpdate',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
