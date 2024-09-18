import clsx from 'clsx';

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export function FormInput({
  label,
  type,
  value,
  placeholder,
  onChange,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col w-full gap-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={clsx(
          'bg-white border border-[#C5C9D6]',
          'w-full px-4 py-2 rounded',
          'focus:outline-none focus:border-[#24AFFE]',
          'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
        )}
        disabled={disabled}
      />
    </div>
  );
}
