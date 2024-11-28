import { HTMLAttributes } from "react";
import { TItem } from "./CustomItem";
type Props = {
    item: TItem;
} & HTMLAttributes<HTMLDivElement>;
declare const SortableListItem: ({ item, ...props }: Props) => import("react/jsx-runtime").JSX.Element;
export default SortableListItem;
