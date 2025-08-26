// components/forms/FormButtons.tsx
"use client";

interface FormButtonsProps {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function FormButtons({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  loadingLabel = "Submitting...",
  loading = false,
  disabled = false,
}: FormButtonsProps) {
  return (
    <div className="flex gap-4 mt-8">
      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 bg-white/5 border border-white/20 text-white py-3 px-4 hover:bg-white/10 transition-all duration-200"
        disabled={loading}
      >
        {cancelLabel}
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={disabled || loading}
        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
