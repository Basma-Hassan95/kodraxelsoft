"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Project } from "@/data/projects";
import { Briefcase, Plus, Trash2, Edit3, ExternalLink } from "lucide-react";

const inputClass =
  "w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

export default function AdminPortfolioPage() {
  const { projects, addProject, updateProject, deleteProject, apiConnected } =
    useAdminData();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] =
    useState<Project["category"]>("AI & Machine Learning");
  const [description, setDescription] = useState("");
  const [metricLabel, setMetricLabel] = useState("Impact");
  const [metrics, setMetrics] = useState("99.8%");
  const [technologies, setTechnologies] = useState("Next.js 16, TypeScript, Tailwind CSS");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [liveProject, setLiveProject] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState("");

  const resetForm = () => {
    setEditingProject(null);
    setTitle("");
    setClient("");
    setTagline("");
    setDescription("");
    setMetricLabel("Impact");
    setMetrics("99.8%");
    setTechnologies("Next.js 16, TypeScript, Tailwind CSS");
    setYear(String(new Date().getFullYear()));
    setImageUrl("");
    setVideoUrl("");
    setLiveUrl("");
    setFeatured(false);
    setLiveProject(true);
  };

  const parseTechs = (value: string) =>
    value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveOk("");
    if (liveProject && !liveUrl.trim()) {
      setSaveError("Live Projects need a Live Website URL so click can open the host.");
      return;
    }
    const techList = parseTechs(technologies);
    const impactMetrics = [
      { label: metricLabel.trim() || "Impact", value: metrics.trim() || "99.8%" },
    ];

    setSaving(true);
    try {
      if (editingProject) {
        await updateProject({
          ...editingProject,
          title,
          client,
          tagline: tagline.trim() || title,
          category,
          description,
          impactMetrics:
            editingProject.impactMetrics.length > 1
              ? [
                  impactMetrics[0],
                  ...editingProject.impactMetrics.slice(1),
                ]
              : impactMetrics,
          technologies: techList.length ? techList : editingProject.technologies,
          image: imageUrl || editingProject.image,
          videoUrl: videoUrl.trim() || undefined,
          demoUrl: liveUrl.trim() || undefined,
          year: year.trim() || editingProject.year,
          featured,
          liveProject,
        });
        setSaveOk("Saved to Supabase successfully.");
      } else {
        await addProject({
          id: `proj-${Date.now()}`,
          title,
          client,
          category,
          tagline: tagline.trim() || title,
          description,
          challenge: description,
          solution: "High-performance production architecture",
          impactMetrics,
          technologies: techList.length
            ? techList
            : ["Next.js 16", "TypeScript", "Tailwind CSS"],
          image:
            imageUrl ||
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
          videoUrl: videoUrl.trim() || undefined,
          year: year.trim() || String(new Date().getFullYear()),
          featured,
          liveProject,
          demoUrl: liveUrl.trim() || undefined,
        });
        setSaveOk("Project created in Supabase successfully.");
      }
      resetForm();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Could not save project to Supabase. Check CMS API / admin login."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setClient(proj.client);
    setTagline(proj.tagline || "");
    setCategory(proj.category);
    setDescription(proj.description);
    setMetricLabel(proj.impactMetrics[0]?.label || "Impact");
    setMetrics(proj.impactMetrics[0]?.value || "99.8%");
    setTechnologies(proj.technologies.join(", "));
    setYear(proj.year || String(new Date().getFullYear()));
    setImageUrl(proj.image);
    setVideoUrl(proj.videoUrl || "");
    setLiveUrl(proj.demoUrl || "");
    setFeatured(proj.featured);
    setLiveProject(Boolean(proj.liveProject));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Projects Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage Case Studies + Live Projects. Saves directly to Supabase `projects` table via CMS API.
        </p>
      </div>

      {!apiConnected && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          CMS API offline or admin session missing — projects will NOT save to Supabase.
          Login again and ensure the API is running / env URLs point to your live API.
        </div>
      )}

      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>
            {editingProject
              ? `Edit: ${editingProject.title}`
              : "Add New Project"}
          </span>
        </h3>

        {saveError && (
          <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {saveError}
          </div>
        )}
        {saveOk && (
          <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            {saveOk}
          </div>
        )}

        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Project Title *</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Aegis AI Threat Detection"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Client Name *</label>
              <input
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className={inputClass}
                placeholder="Aegis CyberCorp"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Project["category"])
                }
                className={inputClass}
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
              <label className="block text-xs font-semibold mb-1">Tagline</label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className={inputClass}
                placeholder="Short one-line project pitch"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Year</label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputClass}
                placeholder="2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Cover Image URL *</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputClass}
                placeholder="https://…/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Video URL (optional mp4/webm)
              </label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className={inputClass}
                placeholder="https://…/demo.mp4"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Live Website URL
              </label>
              <input
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className={inputClass}
                placeholder="https://client-site.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Technologies (comma separated)
              </label>
              <input
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className={inputClass}
                placeholder="Next.js, TypeScript, Supabase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Metric Label</label>
              <input
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                className={inputClass}
                placeholder="Threat Detection Rate"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Metric Value *</label>
              <input
                required
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                className={inputClass}
                placeholder="99.8% or $1.4B+"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="What we built, impact, and architecture highlights…"
            />
          </div>

          <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Where should this appear?
            </p>
            <label className="flex items-start gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={liveProject}
                onChange={(e) => setLiveProject(e.target.checked)}
                className="rounded border-slate-400 mt-0.5"
              />
              <span>
                <span className="text-slate-900 dark:text-white">Live Projects</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Homepage Projects section — click opens live website (recommended for new projects)
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-slate-400 mt-0.5"
              />
              <span>
                <span className="text-slate-900 dark:text-white">Case Studies</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Only check this if you want it in the Case Studies carousel too
                </span>
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md disabled:opacity-60"
            >
              {saving
                ? "Saving to Supabase..."
                : editingProject
                  ? "Save Changes"
                  : "Publish Project"}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Published ({projects.length})
        </h3>
        {projects.map((proj) => (
          <GlowCard key={proj.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-900">
              {proj.videoUrl ? (
                <video
                  src={proj.videoUrl}
                  poster={proj.image || undefined}
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proj.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 dark:text-white">{proj.title}</div>
              <div className="text-[11px] text-slate-500">
                {proj.client} · {proj.category}
                {proj.featured ? " · Case Study" : ""}
                {proj.liveProject ? " · Live Projects" : ""}
                {proj.videoUrl ? " · Video" : ""}
              </div>
              {proj.tagline && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                  {proj.tagline}
                </p>
              )}
              {proj.demoUrl && (
                <a
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-500 inline-flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-3 h-3" /> {proj.demoUrl}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(proj)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => void deleteProject(proj.id)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
