import clsx from 'clsx';

interface TextAreaProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export function TextArea({
  label,
  value,
  placeholder,
  onChange,
  required = false,
}: TextAreaProps) {
  return (
    <div className="flex flex-col w-full gap-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={clsx(
          'bg-white border border-[#C5C9D6]',
          'w-full px-4 py-2 rounded',
          'focus:outline-none focus:border-[#24AFFE]',
          'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
        )}
        rows={4}
        required={required}
      />
    </div>
  );
}
