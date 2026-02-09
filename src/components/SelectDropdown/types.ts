import type { ReactNode } from 'react';

export interface Option {
    value: string;
    label: string;
    icon?: ReactNode;
}

export interface SelectDropdownProps {
    /** Unique identifier for the component */
    id?: string;

    /** Array of options to display */
    options: Option[];

    /** Currently selected value(s) */
    value?: string | string[];

    /** Callback fired when selection changes */
    onChange?: (value: string | string[]) => void;

    /** Enable search functionality (default: true) */
    withSearch?: boolean;

    /** Enable multiple selection (default: false) */
    multiple?: boolean;

    /** Use outlined style for search input (default: true) */
    outlined?: boolean;

    /** Render dropdown in a portal (default: true) */
    usePortal?: boolean;

    /** Placeholder text */
    placeholder?: string;

    /** Custom option label renderer */
    optionLabel?: (option: Option) => ReactNode;

    /** Additional CSS classes for the trigger */
    className?: string;

    /** Additional CSS classes for the menu */
    menuClassName?: string;

    /** Disable the component */
    disabled?: boolean;
}
