// components/forms/SourceSection.tsx
"use client";

import { Selector } from "./Selector";
import { EntitySelectField } from "./EntitySelectField";
import { useEntityOptions } from "@/hooks/useEntityOptions";
import { useEffect, useState } from "react";

interface SourceSectionProps {
  kind: "INCOME" | "EXPENSE" | "REPAYMENT";
  allowNew: boolean;
  projectId: string;
  value: string;
  onValueChange: (val: string) => void;
  entityId: string | undefined;
  onEntityIdChange: (id: string | undefined) => void;
  mode : "NEW" | "EXISTING";
  onModeChange: (mode :"NEW" | "EXISTING") => void;
 source : "BALANCE" | "LOAN" | "INVESTMENT"
  onSourceChange :  (val: "BALANCE" | "LOAN" | "INVESTMENT") => void;
}

export function SourceSection({
  kind,
  allowNew,
  projectId,
  value,
  onValueChange,
  entityId,
  onEntityIdChange,
  mode,
  onModeChange,
  source,
  onSourceChange
}: SourceSectionProps) {

  // fetch if not BALANCE
  const { filteredOptions, setSearch } = useEntityOptions({
    projectId,
    type: source,
    enabled: source !== "BALANCE" && mode === "EXISTING",
  });

  useEffect(() => {
    if (mode === "NEW") {
      onEntityIdChange(undefined);
    }
  }, [mode, onEntityIdChange]);

  return (
    <div className="space-y-4">
      {/* Source Selector */}
      <Selector 
        value={source}
        onChange={onSourceChange}
        options={[
        { value: "BALANCE", label: "Personal", color: "blue" },
        { value: "LOAN", label: "Loan", color: "orange" },
        { value: "INVESTMENT", label: "Investment", color: "purple" },]}
        />
      {/* Mode toggle (only if allowNew and not BALANCE) */}
      {source !== "BALANCE" && allowNew && (
        <Selector
          value={mode}
          onChange={onModeChange}
          options={[
            { value: "NEW", label: "New", color: "red" },
            { value: "EXISTING", label: "Existing", color: "blue" },
          ]}
        />
      )}

      {/* Entity SelectField */}
      {source !== "BALANCE" && (
        <EntitySelectField
          label="From"
          mode={mode}
          value={value}
          onValueChange={(val) => {
            onValueChange(val);
            setSearch(val);
          }}
          selectedId={entityId}
          onSelectId={onEntityIdChange}
          options={filteredOptions}
          placeholderNew={`Enter new ${source.toLowerCase()} name...`}
          placeholderExisting={`Search existing ${source.toLowerCase()}...`}
        />
      )}
    </div>
  );
}
