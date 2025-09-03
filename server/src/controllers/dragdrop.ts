import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { Context } from 'koa';
import { PluginSettingsResponse } from 'src/services/settings';

export const SortIndexRequestSchema = z.object({
  contentType: z.string(),
  locale: z.string(),
});

export const BatchUpdateRequestSchema = z.object({
  contentType: z.string(),
  updates: z.array(
    z.object({
      id: z.number(),
      rank: z.number(),
    })
  ),
});

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async sortIndex(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const dragdropService = strapi.plugin('drag-drop-content-types').service('dragdrop');

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();
      const payload = await SortIndexRequestSchema.parseAsync({
        contentType: ctx.query.contentType,
        locale: ctx.query.locale,
      });

      ctx.body = await dragdropService.sortIndex({
        ...payload,
        rankFieldName: config.body.rank,
      });
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async batchUpdate(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const dragdropService = strapi.plugin('drag-drop-content-types').service('dragdrop');

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();
      const payload = await BatchUpdateRequestSchema.parseAsync(ctx.request.body);

      try {
        ctx.body = await dragdropService.batchUpdate(config, payload.updates, payload.contentType);
      } catch (err) {
        ctx.throw(500, err);
      }
    } catch (err) {
      ctx.throw(400, err);
    }
  },
});

export default controller;
