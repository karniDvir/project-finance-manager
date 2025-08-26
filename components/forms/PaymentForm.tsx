// components/forms/PaymentForm.tsx
"use client";

import { useState } from "react";
import { SourceSection } from "./SourceSection";
import { DestinationSection } from "./DestinationSection";
import { AmountField } from "./AmountField";
import { NotesField } from "./NotesField";
import { FileUpload } from "./FileUpload";
import { DateField } from "./DateField";
import { FormButtons } from "./FormButtons";
import {paymentConfig} from '@/config/paymentConfig'

export interface PaymentFormData {
  kind: "INCOME" | "EXPENSE" | "REPAYMENT";
  source: "BALANCE" | "LOAN" | "INVESTMENT";
  dest?: "LOAN" | "BENEFICIARIES"
  sourceId: string | null;
  sourceName: string;
  method: "POST" | "PUT";
  destinationId?: string | null;
  destinationName?: string;

  amount: number;
  notes?: string;
  receipt?: string;
  effectiveDate: string;
}

interface NewEntityData{
  name: string;
  amount: number;
  notes?: string;
  receipt?: string; 
  type? :"LOAN" | "INVESTMENT";
  reason? : string;
  effectiveDate: string;
}

interface PaymentFormProps {
  kind: "INCOME" | "EXPENSE" | "REPAYMENT";
  dest?:  "LOAN" | "BENEFICIARIES"
  projectId: string;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PaymentForm({
  kind,
  projectId,
  onSubmit,
  onCancel,
  loading = false,
}: PaymentFormProps) {
  const config = paymentConfig[kind];

  const [sourceId, setSourceId] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("");

  const [destId, setDestId] = useState<string | null>(null);
  const [destName, setDestName] = useState("");

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"NEW" | "EXISTING">("EXISTING");
  const [method, setMethod] =  useState<"POST" | "PUT">("POST")
  const [source, setSource] = useState<"BALANCE" | "LOAN" | "INVESTMENT">("BALANCE");

   const createNewEntity = async(formData :NewEntityData) =>{
      try{
        const endpoint = (kind === "INCOME") ? "loan" : "beneficiaries"
        const response = await fetch(`/api/projects/${projectId}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          ...formData,

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
    const data: PaymentFormData = {
      kind,
      source,
      sourceId,
      sourceName,
      destinationId: destId,
      destinationName: destName,
      method,
      amount : parseFloat(amount),
      notes: notes.trim() || undefined,
      receipt: sourceName || undefined,
      effectiveDate: new Date(effectiveDate).toISOString(),
    };

    if(mode === 'NEW'){
        const entityData  : NewEntityData = {
            name: (kind === 'EXPENSE') ? destName : sourceName,
            amount: parseFloat(amount),
            effectiveDate}
        if (kind === 'EXPENSE'){
            entityData.reason = notes;
        }
        else{
            if (source === 'BALANCE')
                throw new Error("cannot create balance entity")
            entityData.type = source;
            entityData.notes = notes;
        }
    const entityId = await createNewEntity(entityData);
    console.log(entityData);
      if(!entityId)
        throw new Error("cannot fetch")

    kind === 'EXPENSE' ? data.destinationId = entityId : data.sourceId = entityId;  

    }
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8"
    >
        <div className="space-y-6 text-white mb-5">
            {/* Destination */}
            {config.destination && (
            <DestinationSection
                type={config.destination.type as "LOAN" | "BENEFICIARIES"}
                allowNew={config.destination.allowNew}
                projectId={projectId}
                value={destName}
                onValueChange={setDestName}
                entityId={destId}
                onEntityIdChange={setDestId}
                onMethodChange={setMethod}
                mode={mode}
                onModeChange={setMode}
            />
            )}
        </div>

      <div className="space-y-6">
        {/* Source */}
        <SourceSection
          kind={kind}
          allowNew={config.source.allowNew}
          projectId={projectId}
          value={sourceName}
          onValueChange={setSourceName}
          entityId={sourceId}
          onEntityIdChange={setSourceId}
          mode={mode}
          onModeChange={setMode}
          source={source}
          onSourceChange={setSource}
        />
        <AmountField value={amount} onValueChange={setAmount} />
        <NotesField value={notes} onValueChange={setNotes} />
        <FileUpload files={files} onFilesChange={setFiles} />
        <DateField
          value={effectiveDate}
          onValueChange={setEffectiveDate}
          label="Payment Date"
        />
      </div>

      <FormButtons
        onCancel={onCancel}
        submitLabel={`Add ${kind}`}
        loadingLabel={`Adding ${kind}...`}
        loading={loading}
        disabled={!amount || parseFloat(amount) <= 0}
      />
    </form>
  );
}
