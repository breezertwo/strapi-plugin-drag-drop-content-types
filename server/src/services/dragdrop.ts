import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
import type z from 'zod';
import type { PluginSettingsResponse } from './settings';
import type { MoveRequestSchema, SortIndexRequestSchema } from '../controllers/dragdrop';

export interface SortIndexParams extends z.infer<typeof SortIndexRequestSchema> {
  rankFieldName: string;
}

export interface MoveParams extends z.infer<typeof MoveRequestSchema> {
  rankFieldName: string;
}

export interface SortIndexItem {
  id: number;
  documentId: string;
  isPlaceholder?: boolean;
  sourceLocale?: string;
  [key: string]: any;
}

type ContentQueryResponse = { locale: string | null; id: number; documentId: string };

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

const NON_SELECTABLE_TYPES = ['relation', 'component', 'dynamiczone', 'media'];

const getDisplayFields = async (
  strapi: Core.Strapi,
  schema: StrapiTypes.Struct.ContentTypeSchema,
  config: PluginSettingsResponse
) => {
  let titleField = config.body.title;

  if (!titleField) {
    const contentTypeConfig = await strapi
      .plugin('content-manager')
      .service('content-types')
      .findConfiguration(schema);

    titleField = contentTypeConfig?.settings?.mainField;
  }

  return [titleField, config.body.subtitle].filter((field) => {
    const attribute = field ? schema.attributes?.[field] : undefined;
    return !!attribute && !NON_SELECTABLE_TYPES.includes(attribute.type);
  }) as string[];
};

const getOrderedItems = async (
  strapi: Core.Strapi,
  { contentType, rankFieldName, locale }: SortIndexParams,
  config?: PluginSettingsResponse
): Promise<SortIndexItem[]> => {
  const schema = strapi.contentTypes[contentType as StrapiTypes.UID.ContentType];

  if (!schema?.attributes?.[rankFieldName]) {
    return [];
  }

  const hasDraftAndPublish = schema.options?.draftAndPublish === true;

  const select = [
    'id',
    'documentId',
    rankFieldName,
    ...(schema.attributes.locale ? ['locale'] : []),
    ...(config ? await getDisplayFields(strapi, schema, config) : []),
  ];

  const allLocalizations = (await strapi.db.query(contentType).findMany({
    where: hasDraftAndPublish ? { publishedAt: { $eq: null } } : {},
    select: [...new Set(select)],
  })) as ContentQueryResponse[];

  const byRank = (a: Record<string, any>, b: Record<string, any>) =>
    (a[rankFieldName] ?? Infinity) - (b[rankFieldName] ?? Infinity);

  const i18nOptions = schema.pluginOptions?.['i18n'] as { localized?: boolean } | undefined;
  if (i18nOptions?.localized !== true) {
    return [...allLocalizations].sort(byRank) as SortIndexItem[];
  }

  const targetLocale = locale ?? (await getDefaultLocale(strapi));
  if (!targetLocale) {
    return [];
  }

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

  const allUniqueItems = new Map<string, SortIndexItem>();
  localeGroups[targetLocale].forEach((item) => {
    allUniqueItems.set(item.documentId, item as SortIndexItem);
  });

  // Entries that exist in other locales only are kept in the list as read-only
  // placeholders so the ranks shared across locales stay consistent.
  Object.entries(localeGroups).forEach(([localeKey, items]) => {
    items.forEach((item) => {
      if (!allUniqueItems.has(item.documentId)) {
        allUniqueItems.set(item.documentId, {
          ...item,
          sourceLocale: localeKey,
          isPlaceholder: true,
        });
      }
    });
  });

  return Array.from(allUniqueItems.values()).sort(byRank);
};

const dragdrop = ({ strapi }: { strapi: Core.Strapi }) => ({
  isSortable({ contentType, rankFieldName }: { contentType: string; rankFieldName: string }) {
    const schema = strapi.contentTypes[contentType as StrapiTypes.UID.ContentType];
    return { sortable: !!schema?.attributes?.[rankFieldName] };
  },

  async sortIndex(config: PluginSettingsResponse, params: SortIndexParams) {
    return getOrderedItems(strapi, params, config);
  },

  async move(
    config: PluginSettingsResponse,
    { contentType, rankFieldName, locale, id, newIndex }: MoveParams
  ) {
    const items = await getOrderedItems(strapi, { contentType, rankFieldName, locale });

    const oldIndex = items.findIndex((item) => item.id === id);
    if (oldIndex === -1) {
      return [];
    }

    const targetIndex = Math.min(Math.max(newIndex, 0), items.length - 1);

    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Ranks are rewritten to match list positions, which also normalises entries
    // that were never ranked or whose ranks left gaps.
    const ranksByDocumentId = new Map<string, number>();
    const changedIds: number[] = [];

    reordered.forEach((item, index) => {
      if (item[rankFieldName] !== index) {
        ranksByDocumentId.set(item.documentId, index);
        changedIds.push(item.id);
      }
    });

    if (ranksByDocumentId.size === 0) {
      return [];
    }

    await applyRanks(
      strapi,
      contentType as StrapiTypes.UID.CollectionType,
      rankFieldName,
      ranksByDocumentId
    );

    if (config.body.triggerWebhooks) {
      const updatedEntries = await strapi.db.query(contentType).findMany({
        where: { id: { $in: changedIds } },
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

    return [...ranksByDocumentId.entries()].map(([documentId, rank]) => ({ documentId, rank }));
  },
});

export default dragdrop;
