import type { Core } from "@strapi/strapi";
import type * as StrapiTypes from "@strapi/types/dist";
import type z from "zod";
import type { PluginSettingsResponse } from "./settings";
import type { SortIndexRequestSchema } from "../controllers/dragdrop";

export interface SortIndexParams extends z.infer<typeof SortIndexRequestSchema> {
  rankFieldName: string;
}

export interface PlaceholderItem {
  id: number;
  isPlaceholder: true;
  sourceLocale: string;
  [key: string]: any;
}

export interface SortIndexItem {
  id: number;
  isPlaceholder?: boolean;
  sourceLocale?: string;
  [key: string]: any;
}

export interface RankUpdate {
  id: number;
  rank: number;
}

type ContentQueryResponse = { locale: string | null; id: string; documentId: string };

const getDefaultLocale = async (strapi: Core.Strapi): Promise<string | undefined> => {
  if (!strapi.plugins?.["i18n"]) {
    return undefined;
  }

  return strapi.plugin("i18n").service("locales").getDefaultLocale();
};

const dragdrop = ({ strapi }: { strapi: Core.Strapi }) => ({
  async sortIndex({ contentType, rankFieldName, locale }: SortIndexParams) {
    try {
      const schema = strapi.contentTypes[contentType as StrapiTypes.UID.ContentType];

      if (!schema) {
        return [];
      }

      if (!schema.attributes?.[rankFieldName]) {
        return [];
      }

      const hasDraftAndPublish = schema.options?.draftAndPublish === true;

      const allLocalizations = (await strapi.db.query(contentType).findMany({
        where: hasDraftAndPublish ? { publishedAt: { $eq: null } } : {},
      })) as ContentQueryResponse[];

      const byRank = (a: Record<string, any>, b: Record<string, any>) =>
        (a[rankFieldName] ?? Infinity) - (b[rankFieldName] ?? Infinity);

      const i18nOptions = schema.pluginOptions?.["i18n"] as { localized?: boolean } | undefined;
      const isLocalized = i18nOptions?.localized === true;
      if (!isLocalized) {
        return [...allLocalizations].sort(byRank);
      }

      const targetLocale = locale ?? (await getDefaultLocale(strapi));
      if (!targetLocale) {
        return [];
      }

      // Group by locale
      const localeGroups = allLocalizations.reduce<{ [locale: string]: ContentQueryResponse[] }>(
        (acc, item) => {
          const { locale } = item;
          if (locale === null) {
            return acc;
          }
          if (!acc[locale]) {
            acc[locale] = [];
          }
          acc[locale].push(item);
          return acc;
        },
        {},
      );

      if (!localeGroups[targetLocale]) {
        return [];
      }

      const currentItemsMap = new Map();
      localeGroups[targetLocale].forEach((item: any) => {
        currentItemsMap.set(item.documentId, item);
      });

      // Find all unique items across locales
      const allUniqueItems = currentItemsMap;
      Object.entries(localeGroups).forEach(([localeKey, items]) => {
        items.forEach((item: any) => {
          if (!allUniqueItems.has(item.documentId)) {
            allUniqueItems.set(item.documentId, {
              ...item,
              sourceLocale: localeKey,
              isPlaceholder: true,
            });
          }
        });
      });

      const sortedAllItems = Array.from(allUniqueItems.values()).sort(byRank);

      return sortedAllItems;
    } catch (err) {
      console.error("Error in sortIndex:", err);
      return [];
    }
  },

  async batchUpdate(
    config: PluginSettingsResponse,
    updates: RankUpdate[],
    contentType: StrapiTypes.UID.CollectionType,
  ) {
    const shouldTriggerWebhooks = config.body.triggerWebhooks;
    const sortFieldName = config.body.rank;
    const results = [];

    for (const update of updates) {
      const allLocalizations = await strapi.db.query(contentType).findOne({
        where: { id: update.id },
        populate: ["localizations"],
      });

      if (!allLocalizations) {
        continue;
      }

      // `localizations` is only present when the i18n plugin is installed; the query
      // engine silently drops the populate key otherwise.
      const { localizations, ...origin } = allLocalizations;
      for (const entry of [origin, ...(localizations ?? [])]) {
        const updatedEntry = await strapi.db.query(contentType).update({
          where: { id: entry.id },
          data: {
            [sortFieldName]: update.rank,
          },
        });

        if (updatedEntry?.id) {
          results.push(updatedEntry);
        }
      }

      if (shouldTriggerWebhooks) {
        const info: Record<string, unknown> = {
          model: contentType.split(".").pop(),
          entry: {
            id: origin.id,
            ...origin,
          },
        };

        await strapi.get("webhookRunner").executeListener({
          event: "entry.update",
          info,
        });
      }
    }

    return results.map((entry) => ({
      id: entry.id,
      rank: entry[sortFieldName],
    }));
  },
});

export default dragdrop;
