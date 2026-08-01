import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');

    try {
      ctx.body = await settingService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async setSettings(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const { body } = ctx.request;

    try {
      await settingService.setSettings(body);
      ctx.body = await settingService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
