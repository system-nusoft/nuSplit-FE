"use client";

import React from "react";

const CURRENCIES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY",
  "INR", "PKR", "SGD", "AED", "SAR", "MXN", "BRL", "KRW",
  "HKD", "NOK", "SEK", "DKK", "NZD", "ZAR", "THB", "MYR",
];

interface CurrencySelectProps {
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  className?: string;
}

export default function CurrencySelect({
  value,
  onChange,
  label = "Currency",
  className = "",
}: CurrencySelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
