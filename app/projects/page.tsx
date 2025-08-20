"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BackgroundLayout from "@/components/ui/BackgroundLayout";
import Modal from "@/components/ui/Modal";

interface Project {
  id: string;
  name: string;
  description?: string;
  budget: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    
    setCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDescription.trim() || undefined,
          budget: newProjectBudget ? parseFloat(newProjectBudget) : 0,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setNewProjectName("");
        setNewProjectDescription("");
        setNewProjectBudget("");
        setShowCreateModal(false);
        // Automatically open the new project
        router.push(`/projects/${newProject.id}`);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };

  const openProject = (projectId: string) => {
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

  return (
    <BackgroundLayout>
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">My Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your financial projects</p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create new project button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 border-dashed p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Create New Project</h3>
            <p className="text-slate-400 text-sm text-center">Start managing a new financial project</p>
          </button>

          {/* Project folders */}
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => openProject(project.id)}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 cursor-pointer min-h-[200px] flex flex-col"
            >
              {/* Folder icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>

              {/* Project info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  )}
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-600/20 to-slate-700/20 border border-slate-600/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-slate-400 mb-6">Create your first project to get started with financial management</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Create project modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewProjectName("");
          setNewProjectDescription("");
          setNewProjectBudget("");
        }}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
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
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Budget
            </label>
            <input
              type="number"
              value={newProjectBudget}
              onChange={(e) => setNewProjectBudget(e.target.value)}
              placeholder="Enter budget amount..."
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setNewProjectName("");
              setNewProjectDescription("");
              setNewProjectBudget("");
            }}
            className="flex-1 bg-white/5 border border-white/20 text-white py-3 px-4 hover:bg-white/10 transition-all duration-200"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            onClick={createProject}
            disabled={!newProjectName.trim() || creating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </div>
      </Modal>
    </BackgroundLayout>
  );
}
