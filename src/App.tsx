import { useState } from 'react';
import { SelectDropdown } from './components/SelectDropdown';
import './index.css';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
];

function App() {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  
  const [withSearch, setWithSearch] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [outlined, setOutlined] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Select Dropdown Demo
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={withSearch}
                onChange={(e) => setWithSearch(e.target.checked)}
                className="rounded"
              />
              <span>With Search</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={multiple}
                onChange={(e) => {
                  setMultiple(e.target.checked);
                  if (e.target.checked) {
                    setMultiValue([]);
                  } else {
                    setSingleValue('');
                  }
                }}
                className="rounded"
              />
              <span>Multiple</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={outlined}
                onChange={(e) => setOutlined(e.target.checked)}
                className="rounded"
              />
              <span>Outlined</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Country</h2>
          <SelectDropdown
            id="country-select"
            options={countries}
            value={multiple ? multiValue : singleValue}
            onChange={(value) => {
              if (multiple) {
                setMultiValue(value as string[]);
              } else {
                setSingleValue(value as string);
              }
            }}
            withSearch={withSearch}
            multiple={multiple}
            outlined={outlined}
            placeholder="Select a country..."
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Selected Value</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm">
            {JSON.stringify(multiple ? multiValue : singleValue, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
