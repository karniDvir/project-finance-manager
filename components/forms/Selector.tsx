interface SelectorOption<T> {
  value: T;
  label: string;
  color: string;
}

interface SelectorProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: SelectorOption<T>[];
  columns?: number;
}
const colClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function Selector<T extends string>({
  value,
  onChange,
  options,
  columns = options.length,
}: SelectorProps<T>) {
  return (
    <div className={`grid ${colClasses[columns] || "grid-cols-1"} gap-3`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`p-4 border transition-all duration-200 ${
            value === opt.value
              ? `border-${opt.color}-500 bg-${opt.color}-500/10 text-${opt.color}-400`
              : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30 hover:bg-white/10"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
