"use client";

import { SplitMethod } from "@/types";

interface SplitMethodSelectorProps {
  value: SplitMethod;
  onChange: (method: SplitMethod) => void;
}

const METHODS: { value: SplitMethod; label: string; description: string }[] = [
  { value: "EQUAL", label: "Equal", description: "Split evenly" },
  { value: "SHARES", label: "By share", description: "Weighted portions" },
  { value: "PERCENTAGE", label: "By %", description: "Enter percentages" },
  { value: "CUSTOM", label: "Custom", description: "Enter amounts" },
];

export default function SplitMethodSelector({ value, onChange }: SplitMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {METHODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`rounded-xl border-2 p-3 text-left transition-colors ${
            value === m.value
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm font-semibold text-gray-900">{m.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
        </button>
      ))}
    </div>
  );
}
