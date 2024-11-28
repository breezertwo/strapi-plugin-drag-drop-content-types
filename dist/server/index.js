"use strict";
const zod = require("zod");
const bootstrap = ({ strapi: strapi2 }) => {
};
const destroy = ({ strapi: strapi2 }) => {
};
const register = ({ strapi: strapi2 }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const RankUpdateSchema = zod.z.object({
  id: zod.z.number(),
  rank: zod.z.number()
});
const BatchUpdateRequestSchema = zod.z.object({
  contentType: zod.z.string(),
  updates: zod.z.array(RankUpdateSchema)
});
const controller = ({ strapi: strapi2 }) => ({
  async welcome(ctx) {
    const dragdropService = strapi2.plugin("drag-drop-content-types").service("dragdrop");
    try {
      ctx.body = await dragdropService.getWelcomeMessage();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async sortIndex(ctx) {
    const dragdropService = strapi2.plugin("drag-drop-content-types").service("dragdrop");
    try {
      ctx.body = await dragdropService.sortIndex(
        ctx.request.body.contentType,
        ctx.request.body.start,
        ctx.request.body.limit,
        ctx.request.body.locale,
        ctx.request.body.rankFieldName
      );
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async batchUpdate(ctx) {
    const settingService = strapi2.plugin("drag-drop-content-types").service("settings");
    const dragdropService = strapi2.plugin("drag-drop-content-types").service("dragdrop");
    try {
      const config2 = await settingService.getSettings();
      const payload = await BatchUpdateRequestSchema.parseAsync(
        ctx.request.body
      );
      try {
        ctx.body = await dragdropService.batchUpdate(config2, payload.updates, payload.contentType);
      } catch (err) {
        ctx.throw(500, err);
      }
    } catch (err) {
      ctx.throw(400, err);
    }
  }
});
const settings$2 = ({ strapi: strapi2 }) => ({
  async getSettings(ctx) {
    const settingService = strapi2.plugin("drag-drop-content-types").service("settings");
    try {
      ctx.body = await settingService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const settingService = strapi2.plugin("drag-drop-content-types").service("settings");
    const { body } = ctx.request;
    try {
      await settingService.setSettings(body);
      ctx.body = await settingService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  }
});
const controllers = {
  dragdrop: controller,
  settings: settings$2
};
const middlewares = {};
const policies = {};
const dragdrop$1 = {
  //type: admin: internal and can be accessible only by the admin part (front-end part) of the plugin
  //type: content-api: accessible from external classical rest api, need to set access in strapi's Users & Permissions plugin
  //call: http://localhost:1337/api/drag-drop-content-types/ and you'll receive getWelcomeMessage()
  type: "admin",
  //changed from content-api to admin
  routes: [
    {
      method: "GET",
      path: "/welcome",
      handler: "dragdrop.welcome",
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: "POST",
      path: "/sort-index",
      handler: "dragdrop.sortIndex",
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: "PUT",
      path: "/batch-update",
      handler: "dragdrop.batchUpdate",
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};
const settings$1 = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/settings",
      handler: "settings.getSettings",
      config: { policies: [] }
    },
    {
      method: "POST",
      path: "/settings",
      handler: "settings.setSettings",
      config: { policies: [] }
    }
  ]
};
const routes = {
  dragdrop: dragdrop$1,
  settings: settings$1
};
const dragdrop = ({ strapi: strapi2 }) => ({
  getWelcomeMessage() {
    return {
      body: "Welcome to Strapi 🚀"
    };
  },
  async sortIndex(contentType, start, limit, locale, rankFieldName) {
    let indexData = {
      sort: {},
      populate: "*",
      start,
      limit,
      locale
    };
    indexData.sort[rankFieldName] = "asc";
    try {
      return await strapi2.documents(contentType).findMany(indexData);
    } catch (err) {
      return {};
    }
  },
  /**
   *
   * @param {RankUpdate[]} updates
   * @param {StrapiTypes.UID.CollectionType} contentType
   */
  async batchUpdate(config2, updates, contentType) {
    const shouldTriggerWebhooks = config2.body.triggerWebhooks;
    const sortFieldName = config2.body.rank;
    const results = [];
    strapi2["apiUpdate"] = true;
    for (const update of updates) {
      const allLocalizations = await strapi2.db.query(contentType).findOne({
        where: { id: update.id },
        populate: ["localizations"]
      });
      const { localizations, ...origin } = allLocalizations;
      for (const entry of [origin, ...localizations]) {
        const updatedEntry = await strapi2.db.query(contentType).update({
          where: { id: entry.id },
          data: {
            [sortFieldName]: update.rank
          }
        });
        if (updatedEntry?.id) {
          results.push(updatedEntry);
        }
      }
      if (shouldTriggerWebhooks) {
        const info = {
          model: contentType.split(".").at(-1),
          entry: {
            id: origin.id,
            ...origin
          }
        };
        await strapi2.get("webhookRunner").executeListener({
          event: "entry.update",
          info
        });
      }
    }
    strapi2["apiUpdate"] = void 0;
    return results.map((entry) => ({
      id: entry.id,
      rank: entry[sortFieldName]
    }));
  }
});
const getPluginStore = () => {
  return strapi.store({
    environment: "",
    type: "plugin",
    name: "drag-drop-content-types"
  });
};
const createDefaultConfig = async () => {
  const pluginStore = getPluginStore();
  const value = {
    body: {
      rank: "rank",
      title: "",
      subtitle: "",
      triggerWebhooks: false
    }
  };
  await pluginStore.set({ key: "settings", value });
  return pluginStore.get({ key: "settings" });
};
const settings = ({ strapi: strapi2 }) => ({
  async getSettings() {
    const pluginStore = getPluginStore();
    let config2 = await pluginStore.get({ key: "settings" });
    if (!config2) {
      config2 = await createDefaultConfig();
    }
    return config2;
  },
  async setSettings(settings2) {
    const value = settings2;
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: "settings", value });
    return pluginStore.get({ key: "settings" });
  }
});
const services = {
  dragdrop,
  settings
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
module.exports = index;
//# sourceMappingURL=index.js.map
