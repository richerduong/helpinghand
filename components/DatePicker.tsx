import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
}

export function SingleDatePicker({ label, value, onChange, required = false }: DatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <div className="flex justify-center mt-4">
        <DatePicker
          selected={value}
          onChange={onChange}
          inline
          placeholderText="Select a date"
        />
      </div>
      <div className="mt-4">
        {value && (
          <div className="bg-gray-200 px-2 py-1 rounded">
            {value instanceof Date ? value.toLocaleDateString() : ''}
          </div>
        )}
      </div>
    </div>
  );
}
