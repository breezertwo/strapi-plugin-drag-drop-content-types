import { Flex } from '@strapi/design-system';
import { Box, Grid, Typography } from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { CSSProperties, forwardRef, HTMLAttributes } from 'react';
import { FetchedSettings } from './types';

export type TItem = {
  id: number;
  title: string;
  subtitle: string;
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
    return (
      <Box
        ref={ref}
        style={{
          ...style,
          border: isSelected ? '2px solid #ac73e6' : '2px solid transparent',
        }}
        background={isDragging ? '#62629d' : '#27273f'}
        cursor={isDragging ? 'grabbing' : 'grab'}
        transform={isDragging ? 'scale(1.05)' : 'scale(1)'}
        zIndex={isDragging ? 1000 : 1}
        lineHeight="0.5"
        hasRadius
        shadow="filterShadow"
        padding={2}
        margin={1}
        {...props}
      >
        <Flex direction="row" alignItems="center" gap={4}>
          <Drag />
          <Typography fontSize="13px" variant="sigma">
            #{item[settings.rank] + 1}
          </Typography>
          <Flex direction="column" gap={2} alignItems="flex-start">
            <Typography>{item.title}</Typography>
            {item.subtitle && <Typography variant="pi">{item.subtitle}</Typography>}
          </Flex>
        </Flex>
      </Box>
    );
  }
);

export default CustomItem;
