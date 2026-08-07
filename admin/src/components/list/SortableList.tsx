import { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import SortableListItem from './SortableListItem';
import { TItem } from './StyledListItem';
import { SortableListProps } from '../types';

const SortableList = ({
  data,
  settings,
  onSortEnd,
  selectedItemId,
  onItemSelect,
}: SortableListProps) => {
  const [items, setItems] = useState<TItem[]>(data);

  const previousItems = useRef<TItem[]>([]);
  const dragStartItems = useRef<TItem[]>([]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleDragStart = useCallback(() => {
    setItems((currentItems) => {
      previousItems.current = currentItems;
      dragStartItems.current = currentItems;
      return currentItems;
    });
  }, []);

  const handleDragOver = useCallback((event: any) => {
    setItems((currentItems) => move(currentItems, event));
  }, []);

  const handleDragEnd = useCallback(
    (event: any) => {
      if (event.canceled) {
        setItems(previousItems.current);
        return;
      }

      const { source } = event.operation;
      if (!source) return;

      setItems((currentItems) => {
        const oldIndex = dragStartItems.current.findIndex((item) => item.id === source.id);
        const newIndex = currentItems.findIndex((item) => item.id === source.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return currentItems;
        }

        return onSortEnd({ oldIndex, newIndex }) ? currentItems : dragStartItems.current;
      });
    },
    [onSortEnd]
  );

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {items.map((item, index) => (
        <SortableListItem
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
