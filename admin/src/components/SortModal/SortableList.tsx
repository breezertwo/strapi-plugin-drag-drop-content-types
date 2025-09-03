import { useState, useEffect } from 'react';
import { GetPageEntriesResponse, SortableListProps } from './types';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  TouchSensor,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import SortableListItem from './SortableListItem';
import { getSubtitle, getTitle } from './utils';
import { TItem } from './CustomItem';

const SortableList = ({
  data,
  settings,
  onSortEnd,
  selectedItemId,
  onItemSelect,
}: SortableListProps) => {
  let { title, subtitle } = settings;

  const convertDataItem = (pageEntry: GetPageEntriesResponse) => {
    return {
      ...pageEntry,
      title: getTitle(pageEntry, title),
      subtitle: getSubtitle(pageEntry, subtitle ?? '', title),
    };
  };

  const [items, setItems] = useState<TItem[]>([]);

  useEffect(() => {
    const convertedItems = data.map((x) => convertDataItem(x));
    setItems(convertedItems);
  }, [data, title, subtitle]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overItem = items.find((item) => item.id === over.id);

    if (!overItem) {
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((prev) => arrayMove<TItem>(prev, activeIndex, overIndex));
    }

    onSortEnd({ oldIndex: activeIndex, newIndex: overIndex });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {items.map((item) => (
          <SortableListItem
            key={item.id}
            item={item}
            settings={settings}
            isSelected={selectedItemId === item.id}
            onSelectItem={onItemSelect}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
