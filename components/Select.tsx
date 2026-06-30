"use client";

import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

export default function Select({
  label,
  error,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  name,
  id,
  className = "",
  required,
}: SelectProps) {
  const selectId = id || name;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
