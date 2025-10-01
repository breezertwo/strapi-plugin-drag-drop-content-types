import React, { useState } from 'react';
import { MoveDirection, SortMenuProps } from './types';
import { IconButton } from '@strapi/design-system';
import { Drag, ArrowUp, ArrowDown, CaretUp, CaretDown, Loader } from '@strapi/icons';
import SortableList from './SortableList';
import { Modal } from '@strapi/design-system';
import { Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { Box, Flex } from '@strapi/design-system';
import { useDispatch } from 'react-redux';
import { adminApi, unstable_useContentManagerContext } from '@strapi/strapi/admin';

const SortMenu = ({ status, data, onSortEnd, settings }: SortMenuProps) => {
  const [selectedItemId, setSelectedItemId] = useState<number>();

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { model } = unstable_useContentManagerContext();

  const handleMoveItem = (id: number, direction: MoveDirection) => {
    const currentIndex = data.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    switch (direction) {
      case 'up':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        newIndex = Math.min(data.length - 1, currentIndex + 1);
        break;
      case 'top':
        newIndex = 0;
        break;
      case 'bottom':
        newIndex = data.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      onSortEnd({ oldIndex: currentIndex, newIndex });
    }
  };

  return (
    <Modal.Root
      onOpenChange={(open: boolean) => {
        if (!open) {
          dispatch(
            adminApi.util.invalidateTags([{ type: 'Document' as any, id: `${model}_LIST` }])
          );
        }
      }}
    >
      <Modal.Trigger>
        <IconButton
          id="sortable-content-type-plugin--sort-menu-button"
          variant="secondary"
          disabled={status === 'success' ? false : true}
          withTooltip={true}
          label={formatMessage({
            id: getTranslation(
              status === 'success'
                ? 'plugin.settings.sortableList.menuIcon'
                : 'plugin.settings.sortableList.menuIcon.off'
            ),
          })}
        >
          {status === 'loading' ? <Loader /> : <Drag />}
        </IconButton>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Sort content</Modal.Title>
        </Modal.Header>
        <Box maxHeight="calc(100vh - 200px)" overflow="auto" padding={4}>
          <SortableList
            data={data}
            onSortEnd={onSortEnd}
            selectedItemId={selectedItemId}
            onItemSelect={(id) => {
              setSelectedItemId(id);
            }}
            settings={settings}
          />
        </Box>
        <Modal.Footer>
          <Flex justifyContent="flex-end" width="100%" minHeight="32px">
            {selectedItemId && selectedItemId !== -1 && (
              <Flex gap={2}>
                <Button
                  variant="secondary"
                  size="S"
                  startIcon={<CaretUp />}
                  onClick={() => handleMoveItem(selectedItemId, 'top')}
                  disabled={data.findIndex((item) => item.id === selectedItemId) === 0}
                >
                  To Top
                </Button>
                <Button
                  variant="secondary"
                  size="S"
                  startIcon={<ArrowUp />}
                  onClick={() => handleMoveItem(selectedItemId, 'up')}
                  disabled={data.findIndex((item) => item.id === selectedItemId) === 0}
                >
                  Up
                </Button>
                <Button
                  variant="secondary"
                  size="S"
                  startIcon={<ArrowDown />}
                  onClick={() => handleMoveItem(selectedItemId, 'down')}
                  disabled={
                    data.findIndex((item) => item.id === selectedItemId) === data.length - 1
                  }
                >
                  Down
                </Button>
                <Button
                  variant="secondary"
                  size="S"
                  startIcon={<CaretDown />}
                  onClick={() => handleMoveItem(selectedItemId, 'bottom')}
                  disabled={
                    data.findIndex((item) => item.id === selectedItemId) === data.length - 1
                  }
                >
                  To Bottom
                </Button>
              </Flex>
            )}
          </Flex>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SortMenu;
