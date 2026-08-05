import React, { useCallback, useState } from 'react';
import { MoveDirection, SortMenuProps } from '../types';
import { IconButton } from '@strapi/design-system';
import { Drag, ArrowUp, ArrowDown, CaretUp, CaretDown, Loader } from '@strapi/icons';
import SortableList from '../list/SortableList';
import { Modal } from '@strapi/design-system';
import { Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { Box, Flex, Typography } from '@strapi/design-system';
import { useDispatch } from 'react-redux';
import { adminApi, unstable_useContentManagerContext } from '@strapi/strapi/admin';

export const SortModal = ({ status, data, onSortEnd, onOpenChange, settings }: SortMenuProps) => {
  const [selectedItemId, setSelectedItemId] = useState<number>();

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { model } = unstable_useContentManagerContext();

  const handleItemSelect = useCallback((id: number) => setSelectedItemId(id), []);

  const bottomIndexFor = (currentIndex: number) =>
    data.filter((item, index) => index !== currentIndex && typeof item[settings.rank] === 'number')
      .length;

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
        newIndex = Math.min(data.length - 1, bottomIndexFor(currentIndex));
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      onSortEnd({
        oldIndex: currentIndex,
        newIndex,
        position: direction === 'top' || direction === 'bottom' ? direction : undefined,
      });
    }
  };

  const selectedIndex = data.findIndex((item) => item.id === selectedItemId);

  return (
    <Modal.Root
      onOpenChange={(open: boolean) => {
        onOpenChange?.(open);
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
          disabled={status === 'unavailable'}
          withTooltip={true}
          label={formatMessage({
            id: getTranslation(
              status === 'unavailable'
                ? 'plugin.settings.sortableList.menuIcon.off'
                : 'plugin.settings.sortableList.menuIcon'
            ),
          })}
        >
          <Drag />
        </IconButton>
      </Modal.Trigger>
      {status !== 'unavailable' && (
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {formatMessage({
                id: getTranslation('plugin.modal.header.title'),
              })}
            </Modal.Title>
          </Modal.Header>
          <Box maxHeight="calc(100vh - 200px)" overflow="auto" padding={4}>
            {status === 'loading' && (
              <Flex justifyContent="center" padding={6}>
                <Loader />
              </Flex>
            )}
            {status === 'empty' && (
              <Flex justifyContent="center" padding={6}>
                <Typography variant="omega" textColor="neutral600">
                  {formatMessage({ id: getTranslation('plugin.modal.body.empty') })}
                </Typography>
              </Flex>
            )}
            {status === 'success' && (
              <SortableList
                data={data}
                onSortEnd={onSortEnd}
                selectedItemId={selectedItemId}
                onItemSelect={handleItemSelect}
                settings={settings}
              />
            )}
          </Box>
          <Modal.Footer>
            <Flex justifyContent="flex-end" width="100%" minHeight="32px">
              {status === 'success' && selectedItemId && selectedItemId !== -1 && (
                <Flex gap={2}>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<CaretUp />}
                    onClick={() => handleMoveItem(selectedItemId, 'top')}
                    disabled={selectedIndex === 0}
                  >
                    To Top
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<ArrowUp />}
                    onClick={() => handleMoveItem(selectedItemId, 'up')}
                    disabled={selectedIndex === 0}
                  >
                    Up
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<ArrowDown />}
                    onClick={() => handleMoveItem(selectedItemId, 'down')}
                    disabled={selectedIndex === data.length - 1}
                  >
                    Down
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<CaretDown />}
                    onClick={() => handleMoveItem(selectedItemId, 'bottom')}
                    disabled={selectedIndex === bottomIndexFor(selectedIndex)}
                  >
                    To Bottom
                  </Button>
                </Flex>
              )}
            </Flex>
          </Modal.Footer>
        </Modal.Content>
      )}
    </Modal.Root>
  );
};
