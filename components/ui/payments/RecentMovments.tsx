"use client";

import { useEffect, useState } from "react";
import PaymentRow, { PaymentItem } from "@/components/ui/payments/PaymentRow";

interface Props {
  projectId: string;
}

type Kind = "INCOME" | "EXPENSE" | "REPAYMENT";

interface ApiPayment {
  id: string;
  kind: Kind;
  amount: number;
  date?: string;
  createdAt?: string;
  notes?: string | null;

  source?: "LOAN" | "BALANCE" | "INVESTMENT";
  sourceType?: "LOAN" | "BALANCE" | "INVESTMENT";
  sourceName?: string | null;

  beneficiaryId?: string | null;
  beneficiary?: { id: string; name: string | null } | null;
  beneficiaryName?: string | null;

  loanTargetId?: string | null;
  loanTarget?: { id: string; name: string | null } | null;
  loanTargetName?: string | null;
}

export default function ProjectRecentMovements({ projectId }: Props) {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust params if your API uses different names than take/sort
        const res = await fetch(
          `/api/projects/${projectId}/payments?take=10&sort=desc`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load recent movements");
        }
        const data: ApiPayment[] = await res.json();

        const mapped: PaymentItem[] = data.map((p) => ({
          id: p.id,
          kind: p.kind,
          amount: p.amount,
          date: p.date ?? p.createdAt ?? new Date().toISOString(),
          notes: p.notes ?? null,

          source: p.source ?? p.sourceType,
          sourceName: p.sourceName ?? null,

          beneficiaryId: p.beneficiaryId ?? null,
          beneficiaryName: p.beneficiary?.name ?? p.beneficiaryName ?? null,

          loanTargetId: p.loanTargetId ?? null,
          loanTargetName: p.loanTarget?.name ?? p.loanTargetName ?? null,
        }));

        if (!abort) setItems(mapped);
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
  }, [projectId]);

  const resolveHref = (it: PaymentItem) => {
    // If your detail pages are project-scoped, change to:
    // `/projects/${projectId}/payments/${it.kind.toLowerCase()}/${it.id}`
    const base = it.kind.toLowerCase(); // income | expense | repayment
    return `/payments/${base}?id=${it.id}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Recent Movements</h2>
          <p className="text-slate-400 text-sm">Last 10 payments in this project</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10">
        {/* Header */}
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
          <div className="p-6 text-slate-400">No recent movements.</div>
        ) : (
          <div>
            {items.map((it) => (
              <PaymentRow key={it.id} item={it} href={resolveHref(it)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
