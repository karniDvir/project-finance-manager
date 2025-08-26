// components/forms/NotesField.tsx
"use client";

interface NotesFieldProps {
  value: string;
  onValueChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export function NotesField({
  value,
  onValueChange,
  label = "Other Details",
  placeholder = "Enter additional details...",
  
}: NotesFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200 resize-none"
      />
    </div>
  );
}
