# Makyo Select

A highly customizable React dropdown component with search, multi-select, and portal support.

## Installation

```bash
npm install makyo-select
# or via git
npm install github:raytqr/makyo-select
```

## Features

- 🔍 Searchable Dropdown
- ✅ Single & Multiple Selection
- 🌐 Portal Support (optional)
- 🎨 Customizable Option Rendering
- ⚡ Virtualized for large lists
- ♿ Accessible

## Usage

### Basic Usage

```tsx
import { SelectDropdown } from 'makyo-select';
import 'makyo-select/styles.css';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

function App() {
  return (
    <SelectDropdown
      options={options}
      onChange={(value) => console.log(value)}
      placeholder="Select Country..."
    />
  );
}
```

### Multiple Selection

```tsx
<SelectDropdown
  options={options}
  multiple={true}
  onChange={(values) => console.log('Selected:', values)}
/>
```

### Custom Option Rendering

```tsx
<SelectDropdown
  options={options}
  optionLabel={(option) => (
    <div className="flex items-center gap-2">
      <img src={`/flags/${option.value}.png`} alt={option.label} />
      <span>{option.label}</span>
    </div>
  )}
/>
```

## Running Development

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Start Demo App
npm run dev
```

## License

MIT
