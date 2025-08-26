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
  name: string;
  source: "BALANCE" | "LOAN" | "INVESTMENT";
  method: "POST" | "PUT"
  loanSourceId: string | null;
  amount: number;
  notes?: string;
  receipt?: string; // text field: loan/investment name
  effectiveDate: string;
}

export interface LoanData {
  id: string;
  name: string;
}

export default function IncomeForm({
  projectId,
  onSubmit,
  onCancel,
  loading = false,
}: IncomeFormProps) {
  const [source, setSource] = useState<"BALANCE" | "LOAN" | "INVESTMENT">("BALANCE");
  const [loanSourceId,setloanSourceId] = useState<string | null>(null);
  const [mode, setMode] = useState<"EXISTING" | "NEW">("NEW");

  const [loans, setLoans] = useState<LoanData[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"POST" | "PUT">("POST")
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [files, setFiles] = useState<File[]>([]);

  // Fetch loans when source or mode changes
  useEffect(() => {
    const fetchLoans = async () => {
      if (source === "BALANCE" || mode === "NEW") return;
      try {
        const response = await fetch(`/api/projects/${projectId}/loan?type=${source}`);
        if (response.ok) {
          const data = await response.json();
          setLoans(data);
          setFilteredLoans(data);
        }
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      }
    };
    fetchLoans();
  }, [source, mode, projectId]);

  // Filter as user types
  useEffect(() => {
    if (name.trim()) {
      setFilteredLoans(
        loans.filter((loan) =>
          loan.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    } else {
      setFilteredLoans(loans.slice(0, 5)); // show first 5 by default
    }
  }, [name, loans]);
  
  useEffect(() =>{
    if (mode === 'NEW') {
      setMethod("POST")
      setloanSourceId(null);
      setName("")
    }
    else
      setMethod("PUT")
  }, [mode])

  
  const createNewLoan = async(formData :IncomeFormData) =>{
    try{
      const response = await fetch(`/api/projects/${projectId}/loan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        ...formData,
        type: source, // add your source type (LOAN | INVESTMENT)}
      }),
      });

      if (!response.ok) {
        console.error("Failed to create income");
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Failed to create income:", error);
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
      name,
      method,
      loanSourceId,
      amount: parseFloat(amount),
      notes: notes.trim() || undefined,
      receipt: name.trim() || undefined, // just the name string
      effectiveDate: new Date(effectiveDate).toISOString(),
    };
    if(mode === 'NEW'){
      const loanId = await createNewLoan(formData);
      if(!loanId)
        throw new Error("cannot fetch")
      formData.loanSourceId = loanId;
    }
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8"
    >
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

        {/* Mode */}
        {source !== "BALANCE" && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { value: "NEW", label: "new", color: "red" },
              { value: "EXISTING", label: "existing", color: "blue" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setMode(option.value as any)
                }}
                className={`p-4 border transition-all duration-200 ${
                  mode === option.value
                    ? `border-${option.color}-500 bg-${option.color}-500/10 text-${option.color}-400`
                    : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* From field */}
        {(source === "LOAN" || source === "INVESTMENT") && (
          <>
            {mode === "EXISTING" ? (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowDropdown(true);
                    setloanSourceId(null);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder={`Search existing ${source.toLowerCase()}...`}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                />

                {showDropdown && filteredLoans.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 backdrop-blur-xl max-h-40 overflow-y-auto">
                    {filteredLoans.map((loan) => (
                      <button
                        key={loan.id}
                        type="button"
                        onClick={() => {
                          setName(loan.name);
                          setloanSourceId(loan.id)
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        {loan.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter new ${source.toLowerCase()} name...`}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                />
              </div>
            )}
          </>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              $
            </span>
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
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <svg
              className="w-12 h-12 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-slate-400 mb-2">
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Drag and drop files here, or click to select"}
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Date */}
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
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Income..." : "Add Income"}
        </button>
      </div>
    </form>
  );
}
