"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import BackgroundLayout from "@/components/ui/BackgroundLayout";
import PaymentsFilters, { PaymentKind, PaymentsFilterState } from "@/components/ui/payments/PaymentFilter";
import PaymentsList from "@/components/ui/payments/PaymentsList";

interface Project {
  id: string;
  name: string;
  description?: string;
  budget: number;
  createdAt: string;
}

interface Props {
  defaultKind: PaymentKind; // which tab this page represents
  title: string;
  actionPath: "income" | "expense" | "repayment";
}

export default function ProjectPaymentsPage({ defaultKind, title, actionPath }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PaymentsFilterState>({
    kind: defaultKind, // start focused on this page kind but allow switching
    type: "ALL",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else if (res.status === 404) {
          router.push("/projects");
        }
      } catch (e) {
        console.error("Failed to fetch project:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, status, router, projectId]);

  if (status === "loading" || loading) {
    return (
      <BackgroundLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </BackgroundLayout>
    );
  }

  if (!project) {
    return (
      <BackgroundLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Project not found</div>
        </div>
      </BackgroundLayout>
    );
  }

  const linkBase = `/projects/${projectId}/payments/${(filters.kind === "ALL" ? defaultKind : filters.kind).toLowerCase()}`;

  return (
    <BackgroundLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="flex items-center text-slate-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {project.name}
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 mb-6 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-slate-400 text-lg">
                View and filter payments for <span className="text-white">{project.name}</span>
              </p>
            </div>
            <button
              onClick={() => router.push(`/projects/${projectId}/actions/${actionPath}`)}
              className="bg-white/5 border border-white/20 text-white px-4 py-2 hover:bg-white/10 transition-all duration-200 flex items-center rounded"
              title={`Add ${actionPath}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New {title.slice(0, -1)}
            </button>
          </div>
        </div>

        {/* Filters */}
        <PaymentsFilters
          initialKind={defaultKind}
          onChange={(s) => setFilters(s)}
        />

        {/* List */}
        <PaymentsList
          projectId={projectId}
          kind={filters.kind}
          pageSize={10}
          linkBase={linkBase}
          title="Results"
          subtitle="Click a row to view the payment details"
          filters={{
            type: filters.type,
            minAmount: filters.minAmount,
            maxAmount: filters.maxAmount,
            from: filters.from,
            to: filters.to,
            counterparty: filters.counterparty,
            notes: filters.notes,
          }}
        />
      </div>
    </BackgroundLayout>
  );
}
