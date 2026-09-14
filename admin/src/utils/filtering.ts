import type { GetPageEntriesResponse } from '../components/types';

export function serializeMatchingParams(params: Record<string, unknown>): string {
  const search = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    if (value === undefined) return;
    if (value !== null && typeof value === 'object') {
      Object.entries(value).forEach(([child, entry]) => append(`${key}[${child}]`, entry));
    } else search.append(key, value === null ? '' : String(value));
  };

  Object.entries(params).forEach(([key, value]) => append(key, value));
  return search.toString();
}

export function getMatchingParams(query: Record<string, any>): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  for (const key of [
    'filters',
    '_q',
    'locale',
    'status',
    'publicationFilter',
    'hasPublishedVersion',
    'publicationStatusFilter',
  ]) {
    if (query[key] !== undefined) params[key] = query[key];
  }

  if (query.plugins?.i18n?.locale !== undefined) params.locale = query.plugins.i18n.locale;

  return params;
}

const hasFilterRules = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasFilterRules);
  if (value === null || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) =>
    ['$and', '$or', '$not'].includes(key) ? hasFilterRules(child) : true
  );
};

export const hasMatchingRestrictions = (params: Record<string, unknown>) =>
  Object.entries(params).some(([key, value]) =>
    key === 'filters' ? hasFilterRules(value) : key !== 'locale' && value != null && value !== ''
  );

export function visibleDocuments(items: GetPageEntriesResponse[], documentIds?: string[]) {
  if (!documentIds) return items;
  const matches = new Set(documentIds);
  return items.filter((item) => !item.isPlaceholder && matches.has(item.documentId));
}

interface ReturnType {
  results: { documentId: string }[];
  pagination: { pageCount: number };
}

export async function fetchMatchingDocumentIds(fetchPage: (page: number) => Promise<ReturnType>) {
  const ids = new Set<string>();
  let page = 1;
  let pageCount = 1;

  do {
    const result = await fetchPage(page);
    result.results.forEach((item) => ids.add(item.documentId));
    pageCount = result.pagination.pageCount;
    page++;
  } while (page <= pageCount);

  return [...ids];
}
