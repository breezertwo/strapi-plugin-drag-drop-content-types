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

type ContentQueryResponse = { locale: string | null; id: string; documentId: string };

// Keeps the bound parameter count of a single bulk statement below the SQLite ceiling.
const RANK_UPDATE_CHUNK_SIZE = 200;

const getColumnName = (meta: { attributes: Record<string, any> }, attributeName: string) => {
  const attribute = meta.attributes?.[attributeName];
  return attribute && 'columnName' in attribute ? (attribute.columnName as string) : undefined;
};

const applyRanks = async (
  strapi: Core.Strapi,
  contentType: StrapiTypes.UID.CollectionType,
  rankFieldName: string,
  ranksByDocumentId: Map<string, number>
) => {
  const meta = strapi.db.metadata.get(contentType);
  const rankColumn = getColumnName(meta, rankFieldName);
  const documentIdColumn = getColumnName(meta, 'documentId');

  if (!rankColumn || !documentIdColumn) {
    throw new Error(
      `Cannot resolve rank column '${rankFieldName}' on content type '${contentType}'`
    );
  }

  const knex = strapi.db.connection;
  const entries = [...ranksByDocumentId.entries()];

  await strapi.db.transaction(async ({ trx }) => {
    for (let i = 0; i < entries.length; i += RANK_UPDATE_CHUNK_SIZE) {
      const chunk = entries.slice(i, i + RANK_UPDATE_CHUNK_SIZE);
      const cases = chunk.map(() => 'WHEN ? THEN ?').join(' ');
      const bindings = chunk.flatMap(([documentId, rank]) => [documentId, rank]);

      // Matching on documentId rewrites every locale and both draft and published
      // rows of a document in one statement.
      await knex(meta.tableName)
        .transacting(trx)
        .whereIn(
          documentIdColumn,
          chunk.map(([documentId]) => documentId)
        )
        .update(rankColumn, knex.raw(`CASE ?? ${cases} END`, [documentIdColumn, ...bindings]));
    }
  });
};

const getDefaultLocale = async (strapi: Core.Strapi): Promise<string | undefined> => {
  if (!strapi.plugins?.['i18n']) {
    return undefined;
  }

  return strapi.plugin('i18n').service('locales').getDefaultLocale();
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

      const i18nOptions = schema.pluginOptions?.['i18n'] as { localized?: boolean } | undefined;
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
        {}
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
      console.error('Error in sortIndex:', err);
      return [];
    }
  },

  async batchUpdate(
    config: PluginSettingsResponse,
    updates: RankUpdate[],
    contentType: StrapiTypes.UID.CollectionType
  ) {
    const sortFieldName = config.body.rank;
    const ids = updates.map((update) => update.id);

    const rows = (await strapi.db.query(contentType).findMany({
      where: { id: { $in: ids } },
      select: ['id', 'documentId'],
    })) as { id: number; documentId: string }[];

    const documentIdById = new Map(rows.map((row) => [row.id, row.documentId]));

    const ranksByDocumentId = new Map<string, number>();
    for (const update of updates) {
      const documentId = documentIdById.get(update.id);
      if (documentId) {
        ranksByDocumentId.set(documentId, update.rank);
      }
    }

    if (ranksByDocumentId.size === 0) {
      return [];
    }

    await applyRanks(strapi, contentType, sortFieldName, ranksByDocumentId);

    if (config.body.triggerWebhooks) {
      const updatedEntries = await strapi.db.query(contentType).findMany({
        where: { id: { $in: [...documentIdById.keys()] } },
      });
      const model = contentType.split('.').pop();

      await Promise.all(
        updatedEntries.map((entry: Record<string, unknown>) =>
          strapi.get('webhookRunner').executeListener({
            event: 'entry.update',
            info: { model, entry },
          })
        )
      );
    }

    return updates.filter((update) => documentIdById.has(update.id));
  },
});

export default dragdrop;
