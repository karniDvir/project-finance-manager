"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import BackgroundLayout from "@/components/ui/BackgroundLayout";
import Modal from "@/components/ui/Modal";

interface Project {
  id: string;
  name: string;
  description?: string;
  budget: number;
  createdAt: string;
}

interface ProjectStats {
  balance: {
    total: number;
    spent: number;
    remaining: number;
  };
  loans: {
    total: number;
    spent: number;
    remaining: number;
  };
  investments: {
    total: number;
    spent: number;
    remaining: number;
  };
}

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProject();
    fetchStats();
  }, [session, status, router, projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setEditName(data.name);
        setEditDescription(data.description || "");
      } else if (response.status === 404) {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/dashboard`);
      if (response.ok) {
        const data = await response.json(); 
        console.log(data)
        
        // Transform the API response to match our interface
        const transformedStats = {
          balance: {
            total: data.breakdown?.bySource?.BALANCE || 0,
            spent: Math.abs(data.totals?.expense || 0),
            remaining: (data.breakdown?.bySource?.BALANCE || 0) - Math.abs(data.totals?.expense || 0)
          },
          loans: {
            total: data.loans?.totalBorrowed || 0,
            spent: data.loans?.totalRepaid || 0,
            remaining: data.loans?.outstanding || 0
          },
          investments: {
            total: data.breakdown?.bySource?.INVESTMENT || 0,
            spent: 0, // This would need to be calculated based on investment-specific expenses
            remaining: data.breakdown?.bySource?.INVESTMENT || 0
          }
        };
        
        setStats(transformedStats);
      }
    } catch (error) {
      console.error("Failed to fetch project stats:", error);
      // Set default stats if API fails
      setStats({
        balance: { total: 0, spent: 0, remaining: 0 },
        loans: { total: 0, spent: 0, remaining: 0 },
        investments: { total: 0, spent: 0, remaining: 0 }
      });
    }
  };

  const updateProject = async () => {
    if (!editName.trim()) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setSaving(false);
    }
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
      <div className="p-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center text-slate-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        {/* Project header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-slate-400 text-lg mb-4">{project.description}</p>
              )}
              <div className="flex items-center text-sm text-slate-500">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span className="mx-4">•</span>
                <span>Budget: ${project.budget.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-white/5 border border-white/20 text-white px-4 py-2 hover:bg-white/10 transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income */}
          <button 
            onClick={() => router.push(`/projects/${projectId}/actions/income`)}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Income</h3>
            <p className="text-slate-400 text-sm">Add money to the project</p>
          </button>

          {/* Expense */}
          <button 
          onClick={() => router.push(`/projects/${projectId}/actions/expense`)}
          className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Expense</h3>
            <p className="text-slate-400 text-sm">Record project expenses</p>
          </button>

          {/* Repay */}
          <button className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Repay</h3>
            <p className="text-slate-400 text-sm">Repay loans and debts</p>
          </button>
        </div>

        {/* Financial overview */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Funds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance */}
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">Balance</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-white">${stats?.balance.total.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent:</span>
                  <span className="text-red-400">${stats?.balance.spent.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">Remaining:</span>
                  <span className="text-emerald-400">${stats?.balance.remaining.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            {/* Loans */}
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">Loans</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-white">${stats?.loans.total.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent:</span>
                  <span className="text-red-400">${stats?.loans.spent.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">Remaining:</span>
                  <span className="text-orange-400">${stats?.loans.remaining.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            {/* Investments */}
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">Investments</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-white">${stats?.investments.total.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent:</span>
                  <span className="text-red-400">${stats?.investments.spent.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">Remaining:</span>
                  <span className="text-purple-400">${stats?.investments.remaining.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit project modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditName(project.name);
          setEditDescription(project.description || "");
        }}
        title="Edit Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => {
              setShowEditModal(false);
              setEditName(project.name);
              setEditDescription(project.description || "");
            }}
            className="flex-1 bg-white/5 border border-white/20 text-white py-3 px-4 hover:bg-white/10 transition-all duration-200"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={updateProject}
            disabled={!editName.trim() || saving}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>
    </BackgroundLayout>
  );
}
