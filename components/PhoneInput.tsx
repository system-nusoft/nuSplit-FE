"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const COUNTRY_CODES = [
  { code: "+1",   flag: "🇺🇸", name: "United States" },
  { code: "+1",   flag: "🇨🇦", name: "Canada" },
  { code: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+39",  flag: "🇮🇹", name: "Italy" },
  { code: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "+47",  flag: "🇳🇴", name: "Norway" },
  { code: "+45",  flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+41",  flag: "🇨🇭", name: "Switzerland" },
  { code: "+43",  flag: "🇦🇹", name: "Austria" },
  { code: "+32",  flag: "🇧🇪", name: "Belgium" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+30",  flag: "🇬🇷", name: "Greece" },
  { code: "+48",  flag: "🇵🇱", name: "Poland" },
  { code: "+7",   flag: "🇷🇺", name: "Russia" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+95",  flag: "🇲🇲", name: "Myanmar" },
  { code: "+66",  flag: "🇹🇭", name: "Thailand" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+62",  flag: "🇮🇩", name: "Indonesia" },
  { code: "+63",  flag: "🇵🇭", name: "Philippines" },
  { code: "+84",  flag: "🇻🇳", name: "Vietnam" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+64",  flag: "🇳🇿", name: "New Zealand" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+54",  flag: "🇦🇷", name: "Argentina" },
  { code: "+57",  flag: "🇨🇴", name: "Colombia" },
  { code: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "+56",  flag: "🇨🇱", name: "Chile" },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  label?: string;
}

function parsePhone(full: string): { dialCode: string; local: string } {
  for (const c of [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)) {
    if (full.startsWith(c.code)) {
      return { dialCode: c.code, local: full.slice(c.code.length) };
    }
  }
  return { dialCode: "+92", local: full.replace(/^\+/, "") };
}

export default function PhoneInput({ value, onChange, label }: PhoneInputProps) {
  const { t } = useTranslation();
  const parsed = parsePhone(value || "");
  const [dialCode, setDialCode] = useState(parsed.dialCode);
  const [local, setLocal] = useState(parsed.local);

  function handleDialChange(code: string) {
    setDialCode(code);
    const stripped = local.replace(/^0+/, "");
    onChange(stripped ? `${code}${stripped}` : "");
  }

  function handleLocalChange(val: string) {
    setLocal(val);
    const stripped = val.replace(/^0+/, "");
    onChange(stripped ? `${dialCode}${stripped}` : "");
  }

  const selected = COUNTRY_CODES.find((c) => c.code === dialCode) ?? COUNTRY_CODES[3];

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={dialCode}
            onChange={(e) => handleDialChange(e.target.value)}
            className="appearance-none ps-3 pe-7 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-full"
          >
            {COUNTRY_CODES.map((c, i) => (
              <option key={`${c.code}-${i}`} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
          <span className="absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
        </div>
        <input
          type="tel"
          dir="ltr"
          value={local}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="3001234567"
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {t("phoneInput.hint")}
      </p>
    </div>
  );
}
