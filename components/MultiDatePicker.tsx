import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label: string;
  value: Date[];
  onChange: (dates: Date[]) => void;
  required?: boolean;
}

export function MultiDatePicker({ label, value = [], onChange, required = false }: DatePickerProps) {
  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    // Check if the date is already selected
    const dateExists = value.some(d => d.getTime() === date.getTime());

    if (dateExists) {
      // If the date is already in the selected array, remove it
      onChange(value.filter(d => d.getTime() !== date.getTime()));
    } else {
      // If the date is not in the selected array, add it
      onChange([...value, date]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <div className="flex justify-center mt-4">
        <DatePicker
          selected={null}
          onChange={(date) => handleDateChange(date as Date)}
          inline
          placeholderText="Select your available dates"
          highlightDates={value}
        />
      </div>
      <div className="mt-4">
        {value && value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((date, index) => (
              <div
                key={index}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                {date.toLocaleDateString()}
                <button
                  type="button"
                  className="ml-2 text-red"
                  onClick={() => handleDateChange(date)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
