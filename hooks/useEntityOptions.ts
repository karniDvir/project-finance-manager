// hooks/useEntityOptions.ts
"use client";

import { useEffect, useState } from "react";

export interface EntityOption {
  id: string;
  name: string;
}

interface UseEntityOptionsParams {
  projectId: string;
  type: "LOAN" | "INVESTMENT" | "BENEFICIARIES" | "BALANCE"; 
  enabled?: boolean; 
}

export function useEntityOptions({ projectId, type, enabled = true }: UseEntityOptionsParams) {
  const [allOptions, setAllOptions] = useState<EntityOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<EntityOption[]>([]);
  const [search, setSearch] = useState("");

  // fetch data
  useEffect(() => {
    if (!enabled) return;

    const fetchEntities = async () => {
      try {
        const query =
          type === "LOAN" || type === "INVESTMENT"
            ? `loan?type=${type}`
            : `${type.toLowerCase()}`;

        const api = `/api/projects/${projectId}/${query}`;
        console.log(api);
        const res = await fetch(api);
        if (res.ok) {
          const data = await res.json();
          setAllOptions(data);
          setFilteredOptions(data.slice(0, 5)); // initial top 5
        }
      } catch (err) {
        console.error(`Failed to fetch ${type}`, err);
      }
    };

    fetchEntities();
  }, [projectId, type, enabled]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        setFilteredOptions(
          allOptions.filter((opt) =>
            opt.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      } else {
        setFilteredOptions(allOptions.slice(0, 5));
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, allOptions]);

  return { filteredOptions, setSearch, allOptions };
}
