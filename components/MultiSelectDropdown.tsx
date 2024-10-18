import Select from 'react-select';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  selectedOptions: Option[];
  onChange: (selected: Option[]) => void;
  required?: boolean;
}

export function MultiSelectDropdown({
  label,
  options,
  selectedOptions,
  onChange,
  required = false,
}: MultiSelectDropdownProps) {
  return (
    <div className="flex flex-col w-full gap-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(selected) => onChange(selected as Option[])}
        classNamePrefix="react-select"
        required={required}
      />
    </div>
  );
}
