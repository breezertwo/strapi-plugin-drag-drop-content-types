export type MoveDirection = 'up' | 'down' | 'top' | 'bottom';

export type SortModalStatus = 'unavailable' | 'loading' | 'empty' | 'success' | 'error';

export interface SortMenuProps {
  fullData: GetPageEntriesResponse[];
  isFiltered: boolean;
  isLoadingEntries: boolean;
  onRetry: () => void;
  status: SortModalStatus;
  data: GetPageEntriesResponse[];
  onSortEnd: (item: UpdateContentRanksParams) => boolean;
  onOpenChange?: (open: boolean) => void;
  settings: FetchedSettings;
}

export interface SortableListProps {
  disabled?: boolean;
  data: GetPageEntriesResponse[];
  onSortEnd: (item: UpdateContentRanksParams) => boolean;
  selectedItemId?: number;
  onItemSelect: (id: number) => void;
  settings: FetchedSettings;
}

export interface SortableListItemProps {
  title?: string;
  subtitle: string;
}

export interface ContentTypeResponse {
  results: { id: number }[];
}

export interface GetPageEntriesResponse {
  id: number;
  documentId: string;
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
  position?: 'top' | 'bottom';
}
