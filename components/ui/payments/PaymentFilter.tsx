"use client";

import { useEffect, useMemo, useState } from "react";

export type PaymentKind = "INCOME" | "EXPENSE" | "REPAYMENT";
export type PaymentSource = "LOAN" | "BALANCE" | "INVESTMENT";

export interface PaymentsFilterState {
  kind: PaymentKind | "ALL";
  type?: PaymentSource | "ALL";
  counterparty?: string;
  minAmount?: number;
  maxAmount?: number;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  notes?: string;
}

interface Props {
  initialKind?: PaymentKind | "ALL";
  onChange: (state: PaymentsFilterState) => void;
}

export default function PaymentsFilters({ initialKind = "ALL", onChange }: Props) {
  const [state, setState] = useState<PaymentsFilterState>({
    kind: initialKind,
    type: "ALL",
    counterparty: "",
    minAmount: undefined,
    maxAmount: undefined,
    from: "",
    to: "",
    notes: "",
  });

  // Emit debounced changes
  useEffect(() => {
    const id = setTimeout(() => onChange(state), 250);
    return () => clearTimeout(id);
  }, [state, onChange]);

  const typeDisabled = useMemo(() => state.kind !== "INCOME", [state.kind]);

  const clear = () =>
    setState({
      kind: initialKind,
      type: "ALL",
      counterparty: "",
      minAmount: undefined,
      maxAmount: undefined,
      from: "",
      to: "",
      notes: "",
    });

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Kind */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Kind</label>
          <select
            value={state.kind}
            onChange={(e) =>
              setState((s) => ({ ...s, kind: e.target.value as any }))
            }
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2"
          >
            <option value="ALL">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
            <option value="REPAYMENT">Repayment</option>
          </select>
        </div>

        {/* Type (only for incomes) */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <select
            disabled={typeDisabled}
            value={state.type ?? "ALL"}
            onChange={(e) =>
              setState((s) => ({ ...s, type: e.target.value as any }))
            }
            className={`w-full bg-white/5 border border-white/10 text-white px-3 py-2 ${typeDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={typeDisabled ? "Type is only relevant for incomes" : undefined}
          >
            <option value="ALL">All</option>
            <option value="BALANCE">Balance</option>
            <option value="INVESTMENT">Investment</option>
            <option value="LOAN">Loan</option>
          </select>
        </div>

        {/* Counterparty */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Counterparty</label>
          <input
            value={state.counterparty ?? ""}
            onChange={(e) =>
              setState((s) => ({ ...s, counterparty: e.target.value }))
            }
            placeholder="Beneficiary/Loan name…"
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 placeholder-slate-500"
          />
        </div>

        {/* Notes contains */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Notes</label>
          <input
            value={state.notes ?? ""}
            onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
            placeholder="Notes contains…"
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 placeholder-slate-500"
          />
        </div>

        {/* Amount min/max */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Min</label>
            <input
              type="number"
              inputMode="decimal"
              value={state.minAmount ?? ""}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  minAmount: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Max</label>
            <input
              type="number"
              inputMode="decimal"
              value={state.maxAmount ?? ""}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  maxAmount: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">From</label>
            <input
              type="date"
              value={state.from ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, from: e.target.value }))
              }
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">To</label>
            <input
              type="date"
              value={state.to ?? ""}
              onChange={(e) => setState((s) => ({ ...s, to: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={clear}
          className="px-3 py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
