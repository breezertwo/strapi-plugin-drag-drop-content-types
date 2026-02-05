import { useState, useEffect, useRef } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import SortableListItem from './SortableListItem';
import { TItem } from './StyledListItem';
import { GetPageEntriesResponse, SortableListProps } from '../types';
import { getSubtitle, getTitle } from '../../utils/title-transform';

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

  const [items, setItems] = useState<TItem[]>(data.map(convertDataItem));
  const previousItems = useRef<TItem[]>([]);
  const dragStartItems = useRef<TItem[]>([]);

  // useEffect(() => {
  //   const convertedItems = data.map((x) => convertDataItem(x));
  //   setItems(convertedItems);
  // }, [data, title, subtitle]);

  const handleDragStart = () => {
    previousItems.current = [...items];
    dragStartItems.current = [...items];
  };

  const handleDragOver = (event: any) => {
    setItems((currentItems) => move(currentItems, event));
  };

  const handleDragEnd = (event: any) => {
    if (event.canceled) {
      setItems(previousItems.current);
      return;
    }

    const startItems = dragStartItems.current;
    const endItems = items;

    const { source } = event.operation;
    if (!source) return;

    const oldIndex = startItems.findIndex((item) => item.id === source.id);
    const newIndex = endItems.findIndex((item) => item.id === source.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      onSortEnd({ oldIndex, newIndex });
    }
  };

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {data.map(convertDataItem).map((item, index) => (
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
