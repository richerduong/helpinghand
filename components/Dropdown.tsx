import clsx from 'clsx';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export function Dropdown({
  label,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
}: DropdownProps) {
  return (
    <div className="flex flex-col w-full gap-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={clsx(
          'bg-white border border-[#C5C9D6]',
          'w-full px-4 py-2 rounded',
          'focus:outline-none focus:border-[#24AFFE]',
          'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
        )}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
