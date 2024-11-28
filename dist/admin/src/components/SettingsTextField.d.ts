interface SettingsTextFieldProps {
    fieldName: string;
    displayName: string;
    required: boolean;
    value?: string;
    hasLabel?: boolean;
    hasHint?: boolean;
    hasTooltip?: boolean;
    hasPlaceholder?: boolean;
    type?: string;
    updateItem: (fieldName: string, value: string) => void;
}
declare const SettingsTextField: (props: SettingsTextFieldProps) => import("react/jsx-runtime").JSX.Element;
export default SettingsTextField;
