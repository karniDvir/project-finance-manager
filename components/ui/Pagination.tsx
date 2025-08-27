    "use client";

interface PaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  page,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-4 py-2 bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:bg-white/10 transition-colors"
      >
        Previous
      </button>
      <span className="text-slate-300 text-sm">Page {page}</span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:bg-white/10 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
