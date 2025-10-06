export type MoveDirection = 'up' | 'down' | 'top' | 'bottom';

export interface SortMenuProps {
  status: 'loading' | 'empty' | 'success';
  data: GetPageEntriesResponse[];
  onSortEnd: (item: UpdateContentTypeParams) => void;
  onOpenChange?: (open: boolean) => void;
  settings: FetchedSettings;
}

export interface SortableListProps {
  data: GetPageEntriesResponse[];
  onSortEnd: (item: UpdateContentTypeParams) => void;
  selectedItemId?: number;
  onItemSelect: (id: number) => void;
  settings: FetchedSettings;
}

export interface SortableListItemProps {
  title?: string;
  subtitle: string;
}

export interface QueryParams {
  'plugins[i18n][locale]': string;
}

export interface ContentTypeResponse {
  results: { id: number }[];
}

export interface GetPageEntriesResponse {
  id: number;
  isPlaceholder?: boolean;
  sourceLocale?: string;
  [key: string]: any;
}

export interface ContentTypeConfigResponse {
  data: {
    contentType: {
      settings: {
        bulkable: boolean;
        defaultSortBy: string;
        defaultSortOrder: string;
        filterable: boolean;
        mainField: string;
        pageSize: number;
        searchable: boolean;
      };
      uid: string;
    };
  };
}

export interface FetchedSettings {
  rank: string;
  title: string;
  subtitle: string | null;
}

export interface UpdateContentRanksParams {
  oldIndex: number;
  newIndex: number;
}
