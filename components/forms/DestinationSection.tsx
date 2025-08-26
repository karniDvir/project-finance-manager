// components/forms/DestinationSection.tsx
"use client";

import { Selector } from "./Selector";
import { EntitySelectField } from "./EntitySelectField";
import { useEntityOptions } from "@/hooks/useEntityOptions";
import { useState } from "react";

interface DestinationSectionProps {
  type: "BENEFICIARIES" | "LOAN";
  allowNew: boolean;
  projectId: string;
  value: string;
  onValueChange: (val: string) => void;
  entityId: string | null;
  onEntityIdChange: (id: string | null) => void;
  onMethodChange: (method: "POST" | "PUT") => void;
  mode : "NEW" | "EXISTING"
  onModeChange: (mode :"NEW" | "EXISTING") => void;
}


export function DestinationSection({
  type,
  allowNew,
  projectId,
  value,
  onValueChange,
  entityId,
  onEntityIdChange,
  onMethodChange, 
  mode,
  onModeChange
}: DestinationSectionProps) {

  const { filteredOptions, setSearch } = useEntityOptions({
    projectId,
    type,
    enabled: mode === "EXISTING",
  });

  const handleModeChange = (newMode: "NEW" | "EXISTING") => {
    onModeChange(newMode);
    onMethodChange(newMode === "NEW" ? "POST" : "PUT");
  };

  return (
    <div className="space-y-4">
      <div className="block text-sm font-medium text-slate-300 mb-2">
        Choose {type.toLowerCase()}
      </div>

      {allowNew && (
        <Selector
          value={mode}
          onChange={handleModeChange}
          options={[
            { value: "NEW", label: "New", color: "red" },
            { value: "EXISTING", label: "Existing", color: "blue" }]}
        />
      )}

      <EntitySelectField
        label=""
        mode={mode}
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
          setSearch(val);
        }}
        selectedId={entityId}
        onSelectId={onEntityIdChange}
        options={filteredOptions}
        placeholderNew={`Enter new ${type.toLowerCase()} name...`}
        placeholderExisting={`Search existing ${type.toLowerCase()}...`}
      />
    </div>
  );
}
