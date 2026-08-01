import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { Context } from 'koa';
import { PluginSettingsResponse } from 'src/services/settings';

export const SortIndexRequestSchema = z.object({
  contentType: z.string(),
  locale: z.string().optional(),
});

export const SortableRequestSchema = z.object({
  contentType: z.string(),
});

export const MoveRequestSchema = z.object({
  contentType: z.string(),
  id: z.number().int(),
  newIndex: z.number().int().min(0),
  locale: z.string().optional(),
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

      ctx.body = await dragdropService.sortIndex(config, {
        ...payload,
        rankFieldName: config.body.rank,
      });
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async sortable(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const dragdropService = strapi.plugin('drag-drop-content-types').service('dragdrop');

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();
      const { contentType } = await SortableRequestSchema.parseAsync({
        contentType: ctx.query.contentType,
      });

      ctx.body = dragdropService.isSortable({ contentType, rankFieldName: config.body.rank });
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async move(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const dragdropService = strapi.plugin('drag-drop-content-types').service('dragdrop');

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();
      const payload = await MoveRequestSchema.parseAsync(ctx.request.body);

      try {
        ctx.body = await dragdropService.move(config, {
          ...payload,
          rankFieldName: config.body.rank,
        });
      } catch (err) {
        ctx.throw(500, err);
      }
    } catch (err) {
      ctx.throw(400, err);
    }
  },
});

export default controller;
