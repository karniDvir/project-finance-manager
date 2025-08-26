// components/forms/EntitySelectField.tsx
"use client";

import { useState } from "react";

export interface EntityOption {
  id: string;
  name: string;
}

interface EntitySelectFieldProps {
  label: string;
  mode: "NEW" | "EXISTING";
  value: string;
  onValueChange: (val: string) => void;
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
  options: EntityOption[];
  placeholderNew?: string;
  placeholderExisting?: string;
}

export function EntitySelectField({
  label,
  mode,
  value,
  onValueChange,
  selectedId,
  onSelectId,
  options,
  placeholderNew = "Enter new...",
  placeholderExisting = "Search existing...",
}: EntitySelectFieldProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      {mode === "EXISTING" ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
              setShowDropdown(true);
              onSelectId(null); // reset selected
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholderExisting}
            className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
          />

          {showDropdown && options.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 backdrop-blur-xl max-h-40 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onValueChange(opt.name);
                    onSelectId(opt.id);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholderNew}
          className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
        />
      )}
    </div>
  );
}
