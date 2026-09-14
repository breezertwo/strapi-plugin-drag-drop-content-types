import { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import SortableListItem from './SortableListItem';
import { TItem } from './StyledListItem';
import { SortableListProps } from '../types';

const SortableList = ({
  data,
  disabled,
  settings,
  onSortEnd,
  selectedItemId,
  onItemSelect,
}: SortableListProps) => {
  const [items, setItems] = useState<TItem[]>(data);

  const dragStartItems = useRef<TItem[]>([]);
  const dragStartData = useRef(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleDragStart = useCallback(() => {
    dragStartItems.current = items;
    dragStartData.current = data;
  }, [items, data]);

  const handleDragOver = useCallback((event: any) => {
    setItems((currentItems) => move(currentItems, event));
  }, []);

  const handleDragEnd = useCallback(
    (event: any) => {
      if (event.canceled || disabled || dragStartData.current !== data) {
        setItems(data);
        return;
      }

      const { source } = event.operation;
      if (!source) return;

      const oldIndex = dragStartItems.current.findIndex((item) => item.id === source.id);
      const newIndex = items.findIndex((item) => item.id === source.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      // Keep the mutation outside a state updater, which React may replay.
      if (!onSortEnd({ oldIndex, newIndex })) setItems(data);
    },
    [onSortEnd, disabled, data, items]
  );

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {items.map((item, index) => (
        <SortableListItem
          disabled={disabled}
          key={item.id}
          item={item}
          index={index}
          settings={settings}
          isSelected={selectedItemId === item.id}
          onSelectItem={onItemSelect}
        />
      ))}
    </DragDropProvider>
  );
};

export default SortableList;
