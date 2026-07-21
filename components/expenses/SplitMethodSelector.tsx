"use client";

import { useTranslation } from "react-i18next";
import { SplitMethod } from "@/types";

interface SplitMethodSelectorProps {
  value: SplitMethod;
  onChange: (method: SplitMethod) => void;
}

export default function SplitMethodSelector({ value, onChange }: SplitMethodSelectorProps) {
  const { t } = useTranslation();
  const METHODS: { value: SplitMethod; label: string; description: string }[] = [
    { value: "EQUAL", label: t("splitMethod.equal"), description: t("splitMethod.equalDescription") },
    { value: "SHARES", label: t("splitMethod.shares"), description: t("splitMethod.sharesDescription") },
    { value: "PERCENTAGE", label: t("splitMethod.percentage"), description: t("splitMethod.percentageDescription") },
    { value: "CUSTOM", label: t("splitMethod.custom"), description: t("splitMethod.customDescription") },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {METHODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`rounded-xl border-2 p-3 text-start transition-colors ${
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
