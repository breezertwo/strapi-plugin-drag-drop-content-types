import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
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

type AccessResult = 'ok' | 'unknown-content-type' | 'forbidden';

const checkAccess = (
  strapi: Core.Strapi,
  ctx: Context,
  contentType: string,
  action: 'read' | 'update'
): AccessResult => {
  const schema = strapi.contentTypes[contentType as StrapiTypes.UID.ContentType];

  if (!schema || schema.kind !== 'collectionType') {
    return 'unknown-content-type';
  }

  // The route policy only gates access to the plugin as a whole, so the caller's
  // rights on the targeted content type have to be checked per request.
  const permissionChecker = strapi
    .plugin('content-manager')
    .service('permission-checker')
    .create({ userAbility: ctx.state.userAbility, model: contentType });

  return permissionChecker.cannot[action]() ? 'forbidden' : 'ok';
};

const rejectAccess = (ctx: Context, access: AccessResult, contentType: string) => {
  if (access === 'unknown-content-type') {
    return ctx.badRequest(`Unknown collection type '${contentType}'`);
  }

  return ctx.forbidden();
};

const fail = (ctx: Context, strapi: Core.Strapi, err: unknown, message: string) => {
  if (err instanceof z.ZodError) {
    return ctx.badRequest('Invalid request', { errors: err.issues });
  }

  strapi.log.error(`[drag-drop-content-types] ${message}: ${err}`);
  return ctx.internalServerError(message);
};

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

      const access = checkAccess(strapi, ctx, payload.contentType, 'read');
      if (access !== 'ok') {
        return rejectAccess(ctx, access, payload.contentType);
      }

      ctx.body = await dragdropService.sortIndex(config, {
        ...payload,
        rankFieldName: config.body.rank,
      });
    } catch (err) {
      return fail(ctx, strapi, err, 'Could not build the sort index');
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

      if (checkAccess(strapi, ctx, contentType, 'read') !== 'ok') {
        ctx.body = { sortable: false };
        return;
      }

      ctx.body = dragdropService.isSortable({ contentType, rankFieldName: config.body.rank });
    } catch (err) {
      return fail(ctx, strapi, err, 'Could not resolve sortability');
    }
  },

  async move(ctx: Context) {
    const settingService = strapi.plugin('drag-drop-content-types').service('settings');
    const dragdropService = strapi.plugin('drag-drop-content-types').service('dragdrop');

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();
      const payload = await MoveRequestSchema.parseAsync(ctx.request.body);

      const access = checkAccess(strapi, ctx, payload.contentType, 'update');
      if (access !== 'ok') {
        return rejectAccess(ctx, access, payload.contentType);
      }

      ctx.body = await dragdropService.move(config, {
        ...payload,
        rankFieldName: config.body.rank,
      });
    } catch (err) {
      return fail(ctx, strapi, err, 'Could not reorder the content type');
    }
  },
});

export default controller;
