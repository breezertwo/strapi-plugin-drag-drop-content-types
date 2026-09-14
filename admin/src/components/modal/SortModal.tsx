import React, { useCallback, useEffect, useState } from 'react';
import { MoveDirection, SortMenuProps } from '../types';
import { IconButton } from '@strapi/design-system';
import { Drag, ArrowUp, ArrowDown, CaretUp, CaretDown, Loader } from '@strapi/icons';
import SortableList from '../list/SortableList';
import { Modal } from '@strapi/design-system';
import { Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { rankedBlockSize, resolveDropIndex } from '../../utils/ranking';
import { Box, Flex, Typography } from '@strapi/design-system';
import { useDispatch } from 'react-redux';
import { adminApi, unstable_useContentManagerContext } from '@strapi/strapi/admin';

export const SortModal = ({
  status,
  data,
  onSortEnd,
  onOpenChange,
  settings,
  fullData,
  isFiltered,
  isLoadingEntries,
  onRetry,
}: SortMenuProps) => {
  const [selectedItemId, setSelectedItemId] = useState<number>();

  useEffect(() => {
    if (!data.some((item) => item.id === selectedItemId && !item.isPlaceholder))
      setSelectedItemId(undefined);
  }, [data, selectedItemId]);

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { model } = unstable_useContentManagerContext();

  const handleItemSelect = useCallback((id: number) => setSelectedItemId(id), []);

  const bottomIndexFor = (currentIndex: number) =>
    rankedBlockSize(data, settings.rank, currentIndex);

  const canMoveTo = (currentIndex: number, targetIndex: number) =>
    resolveDropIndex(data, settings.rank, currentIndex, targetIndex) !== null;

  const canMoveUp = (currentIndex: number) =>
    currentIndex > 0 && typeof data[currentIndex - 1]?.[settings.rank] === 'number';

  const handleMoveItem = (id: number, direction: MoveDirection) => {
    const currentIndex = data.findIndex((item) => item.id === id);
    if (currentIndex === -1 || isLoadingEntries) return;

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
        newIndex = bottomIndexFor(currentIndex);
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex || direction === 'top' || direction === 'bottom') {
      onSortEnd({
        oldIndex: currentIndex,
        newIndex,
        position: direction === 'top' || direction === 'bottom' ? direction : undefined,
      });
    }
  };

  const selectedIndex = data.findIndex((item) => item.id === selectedItemId);

  const globalSelectedIndex = fullData.findIndex((item) => item.id === selectedItemId);
  const atGlobalBottom =
    globalSelectedIndex >= 0 &&
    typeof fullData[globalSelectedIndex]?.[settings.rank] === 'number' &&
    globalSelectedIndex === rankedBlockSize(fullData, settings.rank, globalSelectedIndex);

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
          {isFiltered && (
            <Box padding={4}>
              <Typography variant="pi">
                {formatMessage({ id: getTranslation('plugin.modal.body.filtered') })}
              </Typography>
            </Box>
          )}
          <Box maxHeight="calc(100vh - 200px)" overflow="auto" padding={4}>
            {status === 'error' && (
              <Flex direction="column" gap={3} padding={6}>
                <Typography>
                  {formatMessage({ id: getTranslation('plugin.modal.body.error') })}
                </Typography>
                <Button onClick={onRetry}>
                  {formatMessage({ id: getTranslation('plugin.modal.body.retry') })}
                </Button>
              </Flex>
            )}
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
                disabled={isLoadingEntries}
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
                    disabled={
                      isLoadingEntries ||
                      globalSelectedIndex < 0 ||
                      (globalSelectedIndex === 0 &&
                        typeof fullData[globalSelectedIndex]?.[settings.rank] === 'number')
                    }
                  >
                    To Top
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<ArrowUp />}
                    onClick={() => handleMoveItem(selectedItemId, 'up')}
                    disabled={isLoadingEntries || !canMoveUp(selectedIndex)}
                  >
                    Up
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<ArrowDown />}
                    onClick={() => handleMoveItem(selectedItemId, 'down')}
                    disabled={
                      isLoadingEntries ||
                      (isFiltered
                        ? typeof data[selectedIndex + 1]?.[settings.rank] !== 'number'
                        : !canMoveTo(selectedIndex, selectedIndex + 1))
                    }
                  >
                    Down
                  </Button>
                  <Button
                    variant="secondary"
                    size="S"
                    startIcon={<CaretDown />}
                    onClick={() => handleMoveItem(selectedItemId, 'bottom')}
                    disabled={isLoadingEntries || globalSelectedIndex < 0 || atGlobalBottom}
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
