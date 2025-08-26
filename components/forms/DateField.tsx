// components/forms/DateField.tsx
"use client";

interface DateFieldProps {
  value: string;
  onValueChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export function DateField({
  value,
  onValueChange,
  label = "Date",
  required = true,
}: DateFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
        required={required}
      />
    </div>
  );
}
