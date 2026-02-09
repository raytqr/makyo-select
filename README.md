# Makyo Select

A customizable React dropdown component.

## Install

```bash
npm install makyo-select
```

## Usage

```tsx
import { SelectDropdown } from 'makyo-select';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

function App() {
  const [value, setValue] = useState('');

  return (
    <SelectDropdown
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Option[]` | required | Options to display |
| `value` | `string \| string[]` | - | Selected value |
| `onChange` | `(value) => void` | - | Change handler |
| `withSearch` | `boolean` | `true` | Show search input |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `outlined` | `boolean` | `true` | Outlined style |
| `usePortal` | `boolean` | `true` | Render in portal |
| `placeholder` | `string` | `''` | Placeholder text |
| `optionLabel` | `(option) => ReactNode` | - | Custom renderer |
| `disabled` | `boolean` | `false` | Disable component |

## Option Interface

```typescript
interface Option {
  value: string;
  label: string;
  icon?: ReactNode;
}
```

## Examples

### Multiple Selection

```tsx
<SelectDropdown
  options={options}
  value={selected}
  onChange={setSelected}
  multiple={true}
/>
```

### Without Search

```tsx
<SelectDropdown
  options={options}
  value={value}
  onChange={setValue}
  withSearch={false}
/>
```

### Custom Rendering

```tsx
<SelectDropdown
  options={options}
  value={value}
  onChange={setValue}
  optionLabel={(opt) => (
    <div className="flex items-center gap-2">
      <StatusDot status={opt.value} />
      <span>{opt.label}</span>
    </div>
  )}
/>
```

## License

MIT
