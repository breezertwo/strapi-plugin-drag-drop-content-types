/// <reference types="react" />
interface TooltipIconButtonProps {
    children: React.ReactNode;
    label: string | undefined;
    variant?: string;
    onClick?: () => void;
    disabled?: boolean;
    showBorder?: boolean;
}
declare const TooltipIconButton: ({ children, label, variant, onClick, disabled, showBorder }: TooltipIconButtonProps) => import("react/jsx-runtime").JSX.Element;
export default TooltipIconButton;
