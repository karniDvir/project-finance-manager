"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import BackgroundLayout from "@/components/ui/BackgroundLayout";
import IncomeForm, { IncomeFormData } from "@/components/forms/IncomeForm";

interface Project {
  id: string;
  name: string;
}

export default function IncomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProject();
  }, [session, status, router, projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else if (response.status === 404) {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: IncomeFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect back to project page
        router.push(`/projects/${projectId}`);
      } else {
        console.error("Failed to create income");
      }
    } catch (error) {
      console.error("Failed to create income:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/projects/${projectId}`);
  };

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

  return (
    <BackgroundLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Back button */}
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Add Income</h1>
              <p className="text-slate-400">Record new income for {project.name}</p>
            </div>
          </div>
        </div>

        {/* Income form component */}
        <IncomeForm
          projectId={projectId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </BackgroundLayout>
  );
}
