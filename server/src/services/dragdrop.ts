import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
import type z from 'zod';
import type { PluginSettingsResponse } from './settings';
import type { SortIndexRequestSchema } from '../controllers/dragdrop';

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

type ContentQueryResponse = { locale: string; id: string; documentId: string };

const dragdrop = ({ strapi }: { strapi: Core.Strapi }) => ({
  async sortIndex({ contentType, rankFieldName, locale }: SortIndexParams) {
    try {
      // Get all available locales for this content type
      const allLocalizations = (await strapi.db.query(contentType).findMany({
        where: {
          publishedAt: {
            $eq: null,
          },
        },
      })) as ContentQueryResponse[];

      // Group by locale
      const localeGroups = allLocalizations.reduce<{ [locale: string]: ContentQueryResponse[] }>(
        (acc, item) => {
          const { locale } = item;
          if (!acc[locale]) {
            acc[locale] = [];
          }
          acc[locale].push(item);
          return acc;
        },
        {}
      );

      // Get current locale items as a map for quick lookup
      const currentItemsMap = new Map();
      localeGroups[locale].forEach((item: any) => {
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

      const sortedAllItems = Array.from(allUniqueItems.values()).sort((a, b) => {
        const rankA = a[rankFieldName] ?? Infinity;
        const rankB = b[rankFieldName] ?? Infinity;
        return rankA - rankB;
      });

      return sortedAllItems;
    } catch (err) {
      console.error('Error in sortIndex:', err);
      return [];
    }
  },

  async batchUpdate(
    config: PluginSettingsResponse,
    updates: RankUpdate[],
    contentType: StrapiTypes.UID.CollectionType
  ) {
    const shouldTriggerWebhooks = config.body.triggerWebhooks;
    const sortFieldName = config.body.rank;
    const results = [];

    for (const update of updates) {
      const allLocalizations = await strapi.db.query(contentType).findOne({
        where: { id: update.id },
        populate: ['localizations'],
      });

      const { localizations, ...origin } = allLocalizations;
      for (const entry of [origin, ...localizations]) {
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

      // Trigger webhook listener for updated entry
      if (shouldTriggerWebhooks) {
        const info: Record<string, unknown> = {
          model: contentType.split('.').at(-1),
          entry: {
            id: origin.id,
            ...origin,
          },
        };

        await strapi.get('webhookRunner').executeListener({
          event: 'entry.update',
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
