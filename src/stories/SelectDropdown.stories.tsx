import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SelectDropdown } from '../components/SelectDropdown';
import type { Option } from '../components/SelectDropdown';

const countries: Option[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
];

const userList: Option[] = Array.from({ length: 50 }, (_, i) => ({
    value: `user-${i + 1}`,
    label: `User ${i + 1}`,
}));

const meta: Meta<typeof SelectDropdown> = {
    title: 'Form/Select Dropdown Field',
    component: SelectDropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        id: {
            control: 'text',
            description: 'Unique identifier for the component',
        },
        withSearch: {
            control: 'boolean',
            description: 'Enable search functionality',
        },
        multiple: {
            control: 'boolean',
            description: 'Enable multiple selection',
        },
        outlined: {
            control: 'boolean',
            description: 'Use outlined style for search input',
        },
        usePortal: {
            control: 'boolean',
            description: 'Render dropdown in a portal',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the component',
        },
        options: {
            control: 'object',
            description: 'Array of options',
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '400px', padding: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Label
                </label>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SelectDropdown>;

const ControlledSelect = (props: React.ComponentProps<typeof SelectDropdown>) => {
    const [value, setValue] = useState<string | string[]>(props.multiple ? [] : '');
    return (
        <SelectDropdown
            {...props}
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
                props.onChange?.(newValue);
            }}
        />
    );
};

export const Default: Story = {
    args: {
        id: 'country-select',
        options: countries,
        withSearch: true,
        multiple: false,
        outlined: true,
        usePortal: true,
        placeholder: 'Select...',
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const MultipleSelection: Story = {
    args: {
        ...Default.args,
        multiple: true,
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const WithoutSearch: Story = {
    args: {
        ...Default.args,
        withSearch: false,
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const NotOutlined: Story = {
    args: {
        ...Default.args,
        outlined: false,
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const ManyOptions: Story = {
    args: {
        ...Default.args,
        options: userList,
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const WithoutPortal: Story = {
    args: {
        ...Default.args,
        usePortal: false,
    },
    decorators: [
        (Story) => (
            <div style={{ position: 'relative', minHeight: '300px' }}>
                <Story />
            </div>
        ),
    ],
    render: (args) => <ControlledSelect {...args} />,
};

export const Disabled: Story = {
    args: {
        ...Default.args,
        disabled: true,
    },
    render: (args) => <ControlledSelect {...args} />,
};

const statusOptions: Option[] = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
];

export const CustomOptionRendering: Story = {
    args: {
        ...Default.args,
        options: statusOptions,
        optionLabel: (option: Option) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                            option.value === 'active' ? '#22c55e' :
                            option.value === 'pending' ? '#f59e0b' :
                            option.value === 'completed' ? '#3b82f6' : '#6b7280',
                    }}
                />
                <span>{option.label}</span>
            </div>
        ),
    },
    render: (args) => <ControlledSelect {...args} />,
};

export const ZIndexTest: Story = {
    args: {
        ...Default.args,
    },
    decorators: [
        (Story) => (
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        pointerEvents: 'none',
                    }}
                />
                <div style={{ position: 'relative', zIndex: 1001 }}>
                    <Story />
                </div>
            </div>
        ),
    ],
    render: (args) => <ControlledSelect {...args} />,
};
