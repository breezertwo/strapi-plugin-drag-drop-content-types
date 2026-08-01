import { Flex } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { forwardRef, HTMLAttributes, memo, useMemo } from 'react';
import { FetchedSettings, GetPageEntriesResponse } from '../types';
import { Tooltip } from '@strapi/design-system';
import { getSubtitle, getTitle } from '../../utils/title-transform';

export type TItem = GetPageEntriesResponse;

type StyledListItemProps = {
  item: TItem;
  settings: FetchedSettings;
  isDragging?: boolean;
  isSelected?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const StyledListItemBase = forwardRef<HTMLDivElement, StyledListItemProps>(
  ({ item, isDragging, style, isSelected, settings, ...props }, ref) => {
    const isPlaceholder = item.isPlaceholder;
    const rankValue = item[settings.rank];

    const { title, subtitle } = useMemo(
      () => ({
        title: getTitle(item, settings.title),
        subtitle: getSubtitle(item, settings.subtitle ?? '', settings.title),
      }),
      [item, settings.title, settings.subtitle]
    );

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
        background={isPlaceholder ? 'neutral300' : isDragging ? 'neutral600' : 'neutral150'}
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
            <Typography>{title}</Typography>
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
          {subtitle && <Typography variant="pi">{subtitle}</Typography>}
        </Flex>
      </Flex>
    );
  }
);

export const StyledListItem = memo(StyledListItemBase);
