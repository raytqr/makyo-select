import {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import {
    useFloating,
    useClick,
    useDismiss,
    useRole,
    useListNavigation,
    useInteractions,
    FloatingPortal,
    FloatingFocusManager,
    offset,
    flip,
    size,
    autoUpdate,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { SelectDropdownProps, Option } from './types';


// Search Icon Component
const SearchIcon = () => (
    <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

// Chevron Down Icon
const ChevronDownIcon = () => (
    <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

// Close Icon for chips
const CloseIcon = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
    >
        <svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    </button>
);

// Clear All Icon
const ClearIcon = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
    >
        <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    </button>
);

export function SelectDropdown({
    id = 'sdd-1',
    options,
    value,
    onChange,
    withSearch = true,
    multiple = false,
    outlined = true,
    usePortal = true,
    placeholder = '',
    optionLabel,
    className,
    menuClassName,
    disabled = false,
}: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const selectedIndex = null; // For listNavigation

    const listRef = useRef<(HTMLElement | null)[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Convert value to array for easier handling
    const selectedValues = useMemo(() => {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    }, [value]);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const query = searchQuery.toLowerCase();
        return options.filter((option) =>
            option.label.toLowerCase().includes(query)
        );
    }, [options, searchQuery]);

    // Floating UI setup
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(4),
            flip({ padding: 10 }),
            size({
                apply({ rects, elements, availableHeight }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: `${Math.min(availableHeight, 300)}px`,
                    });
                },
                padding: 10,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'listbox' });
    const listNavigation = useListNavigation(context, {
        listRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
        [click, dismiss, role, listNavigation]
    );

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && withSearch && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
        if (!isOpen) {
            setSearchQuery('');
            setActiveIndex(null);
        }
    }, [isOpen, withSearch]);

    // Handle option selection
    const handleSelect = useCallback(
        (option: Option) => {
            if (multiple) {
                const newValues = selectedValues.includes(option.value)
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value];
                onChange?.(newValues);
            } else {
                onChange?.(option.value);
                setIsOpen(false);
            }
        },
        [multiple, selectedValues, onChange]
    );

    // Handle chip removal
    const handleRemoveChip = useCallback(
        (e: React.MouseEvent, valueToRemove: string) => {
            e.stopPropagation();
            const newValues = selectedValues.filter((v) => v !== valueToRemove);
            onChange?.(multiple ? newValues : newValues[0] || '');
        },
        [selectedValues, onChange, multiple]
    );

    // Handle clear all
    const handleClearAll = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange?.(multiple ? [] : '');
        },
        [onChange, multiple]
    );

    // Handle keyboard events in search
    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && activeIndex !== null) {
            e.preventDefault();
            const option = filteredOptions[activeIndex];
            if (option) {
                handleSelect(option);
            }
        }
    };

    // Get selected options for display
    const selectedOptions = useMemo(() => {
        return selectedValues
            .map((v) => options.find((o) => o.value === v))
            .filter(Boolean) as Option[];
    }, [selectedValues, options]);


    // Highlight search match
    const highlightMatch = (text: string, query: string): ReactNode => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="bg-blue-100 text-blue-800">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    // Render trigger content
    const renderTriggerContent = () => {
        if (selectedOptions.length === 0) {
            return (
                <span className="text-gray-400">{placeholder || 'Select...'}</span>
            );
        }

        if (multiple) {
            return (
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200"
                        >
                            {option.label}
                            <CloseIcon onClick={(e) => handleRemoveChip(e, option.value)} />
                        </span>
                    ))}
                </div>
            );
        }

        return <span>{selectedOptions[0]?.label}</span>;
    };

    // Dropdown menu content
    const menuContent = (
        <FloatingFocusManager context={context} modal={false}>
            <div
                ref={refs.setFloating}
                style={{
                    ...floatingStyles,
                    zIndex: 1050,
                }}
                className={clsx(
                    'bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden',
                    menuClassName
                )}
                {...getFloatingProps()}
            >
                {/* Search Input */}
                {withSearch && (
                    <div
                        className={clsx(
                            'p-2 border-b border-gray-100',
                            outlined ? 'bg-white' : 'bg-transparent'
                        )}
                    >
                        <div
                            className={clsx(
                                'flex items-center gap-2 px-3 py-2 rounded-md',
                                outlined
                                    ? 'bg-white border border-gray-300'
                                    : 'bg-transparent border-0'
                            )}
                        >
                            <SearchIcon />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="flex-1 outline-none text-sm bg-transparent"
                                placeholder="Search..."
                            />
                            {searchQuery && (
                                <ClearIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery('');
                                        searchInputRef.current?.focus();
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Options List */}
                <div className="overflow-y-auto max-h-[250px]">
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => {
                            const isSelected = selectedValues.includes(option.value);
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={option.value}
                                    ref={(node) => {
                                        listRef.current[index] = node;
                                    }}
                                    role="option"
                                    aria-selected={isSelected}
                                    className={clsx(
                                        'px-4 py-2 text-sm cursor-pointer transition-colors',
                                        isActive && 'bg-blue-50',
                                        isSelected && !isActive && 'bg-gray-50',
                                        !isActive && !isSelected && 'hover:bg-gray-50'
                                    )}
                                    {...getItemProps({
                                        onClick: () => handleSelect(option),
                                    })}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {optionLabel ? (
                                                optionLabel(option)
                                            ) : (
                                                <>
                                                    {option.icon && <span>{option.icon}</span>}
                                                    <span>
                                                        {searchQuery
                                                            ? highlightMatch(option.label, searchQuery)
                                                            : option.label}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </FloatingFocusManager>
    );

    return (
        <div id={id}>
            {/* Trigger Button */}
            <button
                type="button"
                ref={refs.setReference}
                className={clsx(
                    'w-full min-h-[42px] px-3 py-2 text-left rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    outlined
                        ? clsx(
                            'bg-white border',
                            isOpen ? 'border-blue-500' : 'border-gray-300'
                          )
                        : 'bg-gray-100 border-0',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                disabled={disabled}
                {...getReferenceProps()}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">{renderTriggerContent()}</div>
                    <div className="flex items-center gap-1">
                        {selectedValues.length > 0 && (
                            <ClearIcon onClick={handleClearAll} />
                        )}
                        <ChevronDownIcon />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen &&
                (usePortal ? (
                    <FloatingPortal>{menuContent}</FloatingPortal>
                ) : (
                    menuContent
                ))}
        </div>
    );
}

export default SelectDropdown;
