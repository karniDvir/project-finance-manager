"use client";

import { useState, useEffect } from "react";
import { Selector } from "./Selector";
import { EntitySelectField } from "./EntitySelectField";
import { AmountField } from "./AmountField";
import { NotesField } from "./NotesField";
import { FileUpload } from "./FileUpload";
import { DateField } from "./DateField";
import { useEntityOptions } from "@/hooks/useEntityOptions";

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
  receipt?: string; 
  effectiveDate: string;
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

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"POST" | "PUT">("POST")
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [files, setFiles] = useState<File[]>([]);


  // Fetch loans when source or mode changes
  const { filteredOptions, setSearch } = useEntityOptions({
  projectId,
  enabled: source !== "BALANCE" && mode === "EXISTING",
  type: source, });
  
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
        type: source,
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
        {/* source select */}
        <Selector 
        value={source}
        onChange={setSource}
        options={[
        { value: "BALANCE", label: "Personal", color: "blue" },
        { value: "LOAN", label: "Loan", color: "orange" },
        { value: "INVESTMENT", label: "Investment", color: "purple" },]}
        />
        {/* Mode */}
        {source !== "BALANCE" && (
        <Selector 
          value={mode}
          onChange={setMode}
          options={[
          { value: "NEW", label: "new", color: "red" },
          { value: "EXISTING", label: "existing", color: "blue" },]}
          />
          )}

        {/* From field */}
        {(source === "LOAN" || source === "INVESTMENT") && (
          <>
            <EntitySelectField 
            label="from"
            mode={mode}
            value={name}
            onValueChange={(val) => {
              setName(val);
              setSearch(val);
            }}
            selectedId={loanSourceId}
            onSelectId={setloanSourceId}
            options={filteredOptions}
            placeholderNew={`Enter new ${source.toLowerCase()} name...`}
            placeholderExisting={`Search existing ${source.toLowerCase()}...`}/>
          </>
        )}

        {/* Amount */}
        <AmountField 
        value={amount} 
        onValueChange={setAmount}/>

        {/* Notes */}
        <NotesField 
        value={notes}
        onValueChange={setNotes}/>

        {/* File attachments */}
        <FileUpload
        files={files}
        onFilesChange={setFiles}/>

        {/* Date */}
        <DateField
        value={effectiveDate}
        onValueChange={setEffectiveDate}/>
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
