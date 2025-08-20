"use client";

import { useState, useEffect } from "react";

interface IncomeFormProps {
  projectId: string;
  onSubmit: (data: IncomeFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface IncomeFormData {
  kind: "INCOME";
  source: "BALANCE" | "LOAN" | "INVESTMENT";
  amount: number;
  notes?: string;
  receipt?: string; // Used for "from" field
  effectiveDate: string;
  loanSourceId?: string;
}

export default function IncomeForm({ projectId, onSubmit, onCancel, loading = false }: IncomeFormProps) {
  const [source, setSource] = useState<"BALANCE" | "LOAN" | "INVESTMENT">("BALANCE");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [notes, setNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<File[]>([]);
  
  // Dropdown state for "from" field
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchFromSuggestions();
  }, [projectId]);

  useEffect(() => {
    // Filter suggestions based on current input
    if (from.trim()) {
      const filtered = fromSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(from.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(fromSuggestions.slice(0, 5)); // Show last 5
    }
  }, [from, fromSuggestions]);

  const fetchFromSuggestions = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/payments?kind=INCOME`);
      if (response.ok) {
        const payments = await response.json();
        // Extract unique "receipt" values (our "from" field) and get the last 5
        const uniqueFroms = Array.from(new Set(
          payments
            .map((payment: any) => payment.receipt)
            .filter(Boolean)
        )).slice(0, 5);
        setFromSuggestions(uniqueFroms as string[]);
      }
    } catch (error) {
      console.error("Failed to fetch from suggestions:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim() || parseFloat(amount) <= 0) return;

    const formData: IncomeFormData = {
      kind: "INCOME",
      source,
      amount: parseFloat(amount),
      notes: notes.trim() || undefined,
      receipt: from.trim() || undefined,
      effectiveDate: new Date(effectiveDate).toISOString(),
    };

    // For LOAN and INVESTMENT sources, we need loanSourceId
    // For now, we'll leave it undefined as we don't have loan selection in this form
    // This should be extended to include loan selection when source is LOAN or INVESTMENT

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8">
      <div className="space-y-6">
        {/* Source Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Source <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "BALANCE", label: "Personal", color: "blue" },
              { value: "LOAN", label: "Loan", color: "orange" },
              { value: "INVESTMENT", label: "Investment", color: "purple" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSource(option.value as any)}
                className={`p-4 border transition-all duration-200 ${
                  source === option.value
                    ? `border-${option.color}-500 bg-${option.color}-500/10 text-${option.color}-400`
                    : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 pl-8 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
              required
            />
          </div>
        </div>

        {/* From (only for loan and investment) */}
        {(source === "LOAN" || source === "INVESTMENT") && (
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              From
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setShowFromDropdown(true);
              }}
              onFocus={() => setShowFromDropdown(true)}
              onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
              placeholder={`Enter ${source.toLowerCase()} source...`}
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
            />
            
            {/* Dropdown */}
            {showFromDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 backdrop-blur-xl max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFrom(suggestion);
                      setShowFromDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Other Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter additional details..."
            rows={3}
            className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200 resize-none"
          />
        </div>

        {/* File attachments */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            File Attachments
          </label>
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/20 bg-white/5 p-8 text-center hover:border-white/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-slate-400 mb-2">
              {files.length > 0 ? `${files.length} file(s) selected` : "Drag and drop files here, or click to select"}
            </p>
            <p className="text-slate-500 text-sm">
              (File upload functionality coming soon)
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 px-3 py-2 text-sm">
                  <span className="text-white">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Income Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
            required
          />
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/5 border border-white/20 text-white py-3 px-4 hover:bg-white/10 transition-all duration-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!amount.trim() || parseFloat(amount) <= 0 || loading}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Income..." : "Add Income"}
        </button>
      </div>
    </form>
  );
}
