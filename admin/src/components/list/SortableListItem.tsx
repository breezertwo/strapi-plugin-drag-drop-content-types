import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HTMLAttributes } from 'react';
import { TItem, StyledListItem } from './StyledListItem';
import { FetchedSettings } from '../types';
import { PointerSensor, useSensor } from '@dnd-kit/core';

type Props = HTMLAttributes<HTMLDivElement> & {
  item: TItem;
  settings: FetchedSettings;
  isSelected?: boolean;
  onSelectItem?: (id: number) => void;
};

const SortableListItem = ({ item, settings, isSelected, onSelectItem, ...props }: Props) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    disabled: item.isPlaceholder,
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

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
      ref={setNodeRef}
      style={styles}
      isDragging={isDragging}
      isSelected={isSelected}
      settings={settings}
      onClick={handleClick}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableListItem;
