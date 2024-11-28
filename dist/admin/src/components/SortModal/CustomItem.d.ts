import { HTMLAttributes } from 'react';
export type TItem = {
    id: number;
    title: string;
    subtitle: string;
};
declare const CustomItem: import("react").ForwardRefExoticComponent<{
    item: TItem;
    isOpacityEnabled?: boolean | undefined;
    isDragging?: boolean | undefined;
} & HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
export default CustomItem;
