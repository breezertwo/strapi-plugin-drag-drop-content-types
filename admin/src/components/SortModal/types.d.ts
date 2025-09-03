export type MoveDirection = 'up' | 'down' | 'top' | 'bottom';

export interface SortMenuProps {
  status: string;
  data: GetPageEntriesResponse[];
  onOpen: () => void;
  onSortEnd: (item: UpdateContentTypeParams) => void;
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
  mainField: string | null;
}

export interface UpdateContentTypeParams {
  oldIndex: number;
  newIndex: number;
}
