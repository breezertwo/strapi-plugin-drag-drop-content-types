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
  let { title, subtitle, mainField } = settings;
  subtitle = subtitle ?? '';
  mainField = mainField ?? '';

  const convertDataItem = (pageEntry: GetPageEntriesResponse) => {
    return {
      ...pageEntry,
      title: getTitle(pageEntry, title, mainField),
      subtitle: getSubtitle(pageEntry, subtitle, title),
    };
  };

  const [items, setItems] = useState<TItem[]>([]);

  // Update items when data prop changes
  useEffect(() => {
    const convertedItems = data.map((x) => convertDataItem(x));
    setItems(convertedItems);
  }, [data, title, subtitle, mainField]);

  // for drag overlay
  const [activeItem, setActiveItem] = useState<TItem>();

  // for input methods detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor)
  );

  // triggered when dragging starts
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(items.find((item) => item.id === active.id));
  };

  // triggered when dragging ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((item) => item.id === active.id);
    const overItem = items.find((item) => item.id === over.id);

    if (!activeItem || !overItem) {
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((prev) => arrayMove<TItem>(prev, activeIndex, overIndex));
    }

    setActiveItem(undefined);
    onSortEnd({ oldIndex: activeIndex, newIndex: overIndex });
  };

  const handleDragCancel = () => {
    setActiveItem(undefined);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
