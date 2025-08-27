"use client";

import { useEffect, useState } from "react";
import PaymentRow, { PaymentItem, PaymentKind } from "@/components/ui/payments/PaymentRow";
import Pagination from "@/components/ui/Pagination";

export interface PaymentsListFilters {
  type?: "LOAN" | "BALANCE" | "INVESTMENT" | "ALL";
  minAmount?: number;
  maxAmount?: number;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  counterparty?: string; // client-side filter
  notes?: string;        // client-side filter
}

interface PaymentsListProps {
  projectId: string;
  kind?: PaymentKind | "ALL";
  pageSize?: number;
  linkBase: string;
  title?: string;
  subtitle?: string;
  filters?: PaymentsListFilters;
}

const fmtCap = (s?: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : s);

export default function PaymentsList({
  projectId,
  kind = "ALL",
  pageSize = 10,
  linkBase,
  title = "Payments",
  subtitle,
  filters,
}: PaymentsListProps) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  useEffect(() => {
    let abort = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (kind !== "ALL") params.set("kind", kind);
        if (filters?.type && filters.type !== "ALL") params.set("type", filters.type);
        if (filters?.minAmount !== undefined) params.set("minAmount", String(filters.minAmount));
        if (filters?.maxAmount !== undefined) params.set("maxAmount", String(filters.maxAmount));
        if (filters?.from) params.set("from", new Date(filters.from).toISOString());
        if (filters?.to) params.set("to", new Date(filters.to).toISOString());
        params.set("skip", String(skip));
        params.set("take", String(pageSize));
        params.set("sort", "desc");
        params.set("sortBy", "date");

        const res = await fetch(
          `/api/projects/${projectId}/payments?${params.toString()}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load payments");
        }
        const data = await res.json();

        const mapped: PaymentItem[] = data.map((p: any) => {
          const sourceEnum = p.source;
          const sourceName =
            sourceEnum === "LOAN" ? p.loanSource?.name ?? null : fmtCap(sourceEnum);

          return {
            id: p.id,
            kind: p.kind,
            amount: p.amount,
            date: p.date ?? p.createdAt ?? new Date().toISOString(),
            notes: p.notes ?? null,

            source: sourceEnum,
            sourceName,

            beneficiaryId: p.beneficiaryId ?? null,
            beneficiaryName: p.beneficiary?.name ?? null,

            loanTargetId: p.loanTargetId ?? null,
            loanTargetName: p.loanTarget?.name ?? null,

            loanSourceId: p.loanSourceId ?? null,
            loanSourceName: p.loanSource?.name ?? null,

            projectId,
          };
        });

        // Client-side extras: counterparty & notes (until backend supports it)
        const filtered = mapped.filter((it) => {
          let ok = true;
          if (filters?.counterparty) {
            const q = filters.counterparty.toLowerCase();
            const names = [
              it.beneficiaryName,
              it.loanTargetName,
              it.sourceName,
              it.sourceName,
            ]
              .filter(Boolean)
              .map((s) => (s as string).toLowerCase());
            ok &&= names.some((n) => n.includes(q));
          }
          if (filters?.notes) {
            ok &&= (it.notes ?? "").toLowerCase().includes(filters.notes.toLowerCase());
          }
          return ok;
        });

        if (!abort) {
          setItems(filtered);
          setHasNext(mapped.length === pageSize); // heuristic; better if API returns total
        }
      } catch (e: any) {
        if (!abort) setError(e.message || "Unknown error");
      } finally {
        if (!abort) setLoading(false);
      }
    };
    run();
    return () => {
      abort = true;
    };
  }, [projectId, kind, pageSize, skip, filters?.type, filters?.minAmount, filters?.maxAmount, filters?.from, filters?.to, filters?.counterparty, filters?.notes]);

  const hasPrev = page > 1;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle ? <p className="text-slate-400 text-sm">{subtitle}</p> : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-white/5 border-b border-white/10 text-slate-400 text-xs">
          <div className="col-span-3">Date</div>
          <div className="col-span-5">Details</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        {loading ? (
          <div className="p-6 text-slate-400">Loading…</div>
        ) : error ? (
          <div className="p-6 text-rose-400">Error: {error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-slate-400">No results.</div>
        ) : (
          <div>
            {items.map((it) => (
              <PaymentRow key={it.id} item={it} href={`${linkBase}/${it.id}`} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={page}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
