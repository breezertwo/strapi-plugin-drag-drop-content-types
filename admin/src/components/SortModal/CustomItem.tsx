import { Flex } from '@strapi/design-system';
import { Box, Grid, Typography } from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { CSSProperties, forwardRef, HTMLAttributes } from 'react';
import { FetchedSettings } from './types';
import { Tooltip } from '@strapi/design-system';

export type TItem = {
  id: number;
  title: string;
  subtitle: string;
  isPlaceholder?: boolean;
  sourceLocale?: string;
  [key: string]: any;
};

type CustomItemProps = {
  item: TItem;
  settings: FetchedSettings;
  isDragging?: boolean;
  isSelected?: boolean;
  onPressItem?: (id: number) => void;
} & HTMLAttributes<HTMLDivElement>;

const CustomItem = forwardRef<HTMLDivElement, CustomItemProps>(
  ({ item, isDragging, style, isSelected, onPressItem, settings, ...props }, ref) => {
    const isPlaceholder = item.isPlaceholder;
    const rankValue = item[settings.rank];

    return (
      <Flex
        direction="row"
        alignItems="center"
        gap={4}
        ref={ref}
        style={{
          ...style,
          border: isSelected ? '2px solid #ac73e6' : '2px solid transparent',
          opacity: isPlaceholder ? 0.6 : 1,
        }}
        background={isPlaceholder ? '#3a3a52' : isDragging ? '#62629d' : '#27273f'}
        cursor={isPlaceholder ? 'not-allowed' : isDragging ? 'grabbing' : 'grab'}
        transform={isDragging ? 'scale(1.05)' : 'scale(1)'}
        zIndex={isDragging ? 1000 : 1}
        minHeight="44px"
        hasRadius
        shadow="filterShadow"
        padding={2}
        margin={1}
        {...props}
      >
        <Drag />
        <Typography fontSize="14px" minWidth="24px" textAlign="center" variant="sigma">
          {rankValue || rankValue === 0 ? `#${rankValue + 1}` : ' - '}
        </Typography>
        <Flex direction="column" gap={2} alignItems="flex-start">
          <Flex direction="row" alignItems="center" gap={2}>
            <Typography>{item.title}</Typography>
            {isPlaceholder && (
              <Tooltip
                delayDuration={50}
                label="This content is not available in your current locale"
              >
                <Typography
                  style={{ cursor: 'help' }}
                  fontSize="11px"
                  variant="sigma"
                  color="#ac73e6"
                  background="#ac73e620"
                  padding={1}
                  hasRadius
                >
                  from {item.sourceLocale}
                </Typography>
              </Tooltip>
            )}
          </Flex>
          {item.subtitle && <Typography variant="pi">{item.subtitle}</Typography>}
        </Flex>
      </Flex>
    );
  }
);

export default CustomItem;
