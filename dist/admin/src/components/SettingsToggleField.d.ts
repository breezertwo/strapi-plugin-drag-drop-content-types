interface SettingsToggleFieldProps {
    fieldName: string;
    displayName: string;
    required: boolean;
    value?: boolean;
    hasLabel?: boolean;
    hasHint?: boolean;
    hasTooltip?: boolean;
    type?: string;
    updateItem: (fieldName: string, value: boolean) => void;
}
declare const SettingsToggleField: (props: SettingsToggleFieldProps) => import("react/jsx-runtime").JSX.Element;
export default SettingsToggleField;
