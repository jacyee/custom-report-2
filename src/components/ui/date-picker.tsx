'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({ label, value, onChange, placeholderText, minDate, maxDate }: DatePickerProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-zinc-200">{label}</label>
      )}
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholderText ?? 'Select date…'}
        minDate={minDate}
        maxDate={maxDate}
        className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        calendarClassName="!bg-zinc-900 !border-zinc-700 !text-zinc-100"
        wrapperClassName="w-full"
      />
    </div>
  );
}
