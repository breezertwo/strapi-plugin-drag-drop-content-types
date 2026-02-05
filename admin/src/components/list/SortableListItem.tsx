import { useSortable } from '@dnd-kit/react/sortable';
import { HTMLAttributes } from 'react';
import { TItem, StyledListItem } from './StyledListItem';
import { FetchedSettings } from '../types';

type Props = HTMLAttributes<HTMLDivElement> & {
  item: TItem;
  index: number;
  settings: FetchedSettings;
  isSelected?: boolean;
  onSelectItem?: (id: number) => void;
};

const SortableListItem = ({ item, index, settings, isSelected, onSelectItem, ...props }: Props) => {
  const { ref, isDragging } = useSortable({
    id: item.id,
    index,
    disabled: item.isPlaceholder,
  });

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if not dragging, onSelect is provided, and not a placeholder
    if (!isDragging && onSelectItem && !item.isPlaceholder) {
      e.stopPropagation();
      onSelectItem(isSelected ? -1 : item.id);
    }
  };

  return (
    <StyledListItem
      item={item}
      ref={ref}
      isDragging={isDragging}
      isSelected={isSelected}
      settings={settings}
      onClick={handleClick}
      {...props}
    />
  );
};

export default SortableListItem;
