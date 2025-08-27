"use client";

import { useRouter } from "next/navigation";

export type PaymentKind = "INCOME" | "EXPENSE" | "REPAYMENT";

export interface PaymentItem {
  id: string;
  kind: PaymentKind;
  amount: number;
  date: string; // ISO
  notes?: string | null;

  // For INCOME
  source?: "LOAN" | "BALANCE" | "INVESTMENT";
  sourceName?: string | null;

  // For EXPENSE
  beneficiaryId?: string | null;
  beneficiaryName?: string | null;

  // For REPAYMENT
  loanTargetId?: string | null;
  loanTargetName?: string | null;
}

interface PaymentRowProps {
  item: PaymentItem;
  href: string; // where to navigate on click
}

const fmt = (v: number) =>
  v.toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function PaymentRow({ item, href }: PaymentRowProps) {
  const router = useRouter();

  // Columns adapt slightly by kind
  const primary =
    item.kind === "INCOME"
      ? item.sourceName || item.source || "—"
      : item.kind === "EXPENSE"
      ? item.beneficiaryName || "—"
      : item.loanTargetName || "—";

  const secondary =
    item.kind === "INCOME"
      ? item.source
      : item.kind === "EXPENSE"
      ? "Beneficiary"
      : "Loan";

  return (
    <div
      onClick={() => router.push(href)}
      className="group grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(href)}
      aria-label={`Open ${item.kind.toLowerCase()} ${item.id}`}
    >
      {/* Date */}
      <div className="col-span-3 text-slate-300 text-sm">
        {new Date(item.date).toLocaleString()}
      </div>

      {/* Main */}
      <div className="col-span-5">
        <div className="text-white font-medium">{primary}</div>
        <div className="text-slate-400 text-xs">{secondary}</div>
        {item.notes ? (
          <div className="text-slate-500 text-xs truncate mt-1">{item.notes}</div>
        ) : null}
      </div>

      {/* Kind badge */}
      <div className="col-span-2">
        <span
          className={`px-2 py-1 text-xs rounded border ${
            item.kind === "INCOME"
              ? "text-emerald-400 border-emerald-400/30 bg-emerald-500/10"
              : item.kind === "EXPENSE"
              ? "text-rose-400 border-rose-400/30 bg-rose-500/10"
              : "text-sky-400 border-sky-400/30 bg-sky-500/10"
          }`}
        >
          {item.kind}
        </span>
      </div>

      {/* Amount */}
      <div className="col-span-2 text-right font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
        {fmt(item.amount)}
      </div>
    </div>
  );
}
