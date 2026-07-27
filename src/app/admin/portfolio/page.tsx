"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Project } from "@/data/projects";
import { Briefcase, Plus, Trash2, Edit3, ExternalLink } from "lucide-react";

export default function AdminPortfolioPage() {
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState<Project["category"]>("AI & Machine Learning");
  const [description, setDescription] = useState("");
  const [metrics, setMetrics] = useState("99.8%");
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const technologies = ["Next.js 16", "TypeScript", "Tailwind CSS"];
    const impactMetrics = [{ label: "Impact Metric", value: metrics || "99.8%" }];

    if (editingProject) {
      updateProject({
        ...editingProject,
        title,
        client,
        category,
        description,
        impactMetrics,
        image: imageUrl || editingProject.image
      });
      setEditingProject(null);
    } else {
      addProject({
        id: `proj-${Date.now()}`,
        title,
        client,
        category,
        tagline: title,
        description,
        challenge: description,
        solution: "Sub-50ms Edge Stream Architecture",
        impactMetrics,
        technologies,
        image: imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        year: "2026",
        featured: true,
        demoUrl: "https://kodraxelsoft.com"
      });
    }

    setTitle("");
    setClient("");
    setDescription("");
    setMetrics("99.8%");
    setImageUrl("");
  };

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setClient(proj.client);
    setCategory(proj.category);
    setDescription(proj.description);
    setMetrics(proj.impactMetrics[0]?.value || "99.8%");
    setImageUrl(proj.image);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Case Studies & Portfolio Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Create, edit, feature, or delete client engineering case studies, impact metrics (`99.8%`, `$1.4B`), images, and live links.
        </p>
      </div>

      {/* Editor Form */}
      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{editingProject ? `Edit Case Study: ${editingProject.title}` : "Add New Client Case Study"}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="Aegis AI Threat Detection"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name *</label>
              <input
                type="text"
                required
                placeholder="Aegis CyberCorp"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Project["category"])}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="SaaS & Web Apps">SaaS & Web Apps</option>
                <option value="Fintech">Fintech</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Impact Metric Value (e.g. 99.8%)</label>
              <input
                type="text"
                required
                placeholder="99.8% or $1.4B+"
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Architectural breakdown of the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingProject ? "Save Case Study Changes" : "Publish Case Study"}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <GlowCard key={proj.id} className="p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                  {proj.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{proj.title}</h3>
                <div className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 mt-0.5">{proj.client}</div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{proj.description}</p>
              
              <div className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ⚡ {proj.impactMetrics[0]?.value || "99.8%"} {proj.impactMetrics[0]?.label || "Impact"}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleEdit(proj)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteProject(proj.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                aria-label="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlowCard>
        ))}
      </div>

    </div>
  );
}
