"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BackgroundLayout from "@/components/ui/BackgroundLayout";
import PaymentForm, { PaymentFormData } from "@/components/forms/PaymentForm";
import { ActionCard } from "@/components/ui/ActionCard";
import { LucideIcon } from "lucide-react";

interface ActionPageProps {
  kind: "INCOME" | "EXPENSE" | "REPAYMENT";
  title: string;
  description: (projectId: string) => string;
  icon: LucideIcon;
  color: "green" | "red" | "yellow" | "blue";
}

export default function ActionPage({
  kind,
  title,
  description,
  icon,
  color,
}: ActionPageProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: PaymentFormData) => {
    setSubmitting(true);
    try {
      const payload: any = {
      ...formData,
    };

    if (formData.kind === "EXPENSE") {
      payload.beneficiaryId = formData.destinationId;
    } else if (formData.kind === "REPAYMENT") {
      payload.loanTargetId = formData.destinationId;
    }

      const response = await fetch(`/api/projects/${projectId}/payments`, {
        method: formData.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({payload}),
      });

      if (response.ok) {
        router.push(`/projects/${projectId}`);
      } else {
        const text = await response.text();
        console.error("Failed to create payment", response.status, text);
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <BackgroundLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="flex items-center text-slate-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to {projectId}
        </button>

        {/* Header */}
        <ActionCard
          title={title}
          description={description(projectId)}
          icon={icon}
          color={color}
        />

        {/* Form */}
        <PaymentForm
          kind={kind}
          projectId={projectId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </BackgroundLayout>
  );
}
