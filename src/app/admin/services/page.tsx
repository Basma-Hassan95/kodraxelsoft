"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { useAdminData } from "@/context/AdminDataContext";
import { Service } from "@/data/services";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClass =
  "w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

export default function AdminServicesPage() {
  const { confirm } = useAdminUi();
  const { services, addService, updateService, deleteService, uploadMediaFile } =
    useAdminData();
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete service?",
      message: "Delete this service? It will disappear from the website.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    await deleteService(id);
  };

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [weeks, setWeeks] = useState("4");
  const [basePrice, setBasePrice] = useState("15,000");
  const [imageUrl, setImageUrl] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setSlug("");
    setDescription("");
    setWeeks("4");
    setBasePrice("15,000");
    setImageUrl("");
    setFeatureInput("");
    setTechInput("");
    setDeliverablesInput("");
    setError("");
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const asset = await uploadMediaFile(file);
      if (asset?.url) setImageUrl(asset.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featureInput
      ? featureInput.split(",").map((f) => f.trim()).filter(Boolean)
      : ["Sub-50ms SLA"];
    const technologies = techInput
      ? techInput.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Next.js 16", "TypeScript"];
    const deliverables = deliverablesInput
      ? deliverablesInput.split("\n").map((d) => d.trim()).filter(Boolean)
      : ["Production Edge Deployment", "Full Source Code"];

    if (editingService) {
      void updateService({
        ...editingService,
        title,
        subtitle: subtitle || title,
        slug: slug || slugify(title) || editingService.id,
        description,
        estimatedWeeks: String(weeks),
        basePrice,
        imageUrl: imageUrl.trim(),
        features,
        technologies,
        deliverables,
      });
      setEditingService(null);
    } else {
      const newId = slug || slugify(title) || `service-${Date.now()}`;
      void addService({
        id: newId,
        slug: newId,
        iconName: "Code",
        title,
        subtitle: subtitle || title,
        description,
        basePrice,
        estimatedWeeks: String(weeks),
        imageUrl: imageUrl.trim(),
        features,
        technologies,
        deliverables,
      });
    }

    resetForm();
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setSubtitle(service.subtitle);
    setSlug(service.slug || service.id);
    setDescription(service.description);
    setWeeks(service.estimatedWeeks);
    setBasePrice(service.basePrice);
    setImageUrl(service.imageUrl || "");
    setFeatureInput(service.features.join(", "));
    setTechInput(service.technologies.join(", "));
    setDeliverablesInput(service.deliverables.join("\n"));
    setError("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Services & Capabilities Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add, edit, or delete services — including accordion background images.
        </p>
      </div>

      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>
            {editingService
              ? `Edit Service: ${editingService.title}`
              : "Create New Engineering Service Pillar"}
          </span>
        </h3>

        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js 16 Edge Architecture"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sprint Duration (e.g. 3-4 Weeks)
              </label>
              <input
                type="text"
                required
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Ultra-fast, SEO-optimized enterprise platforms"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Starting Price
              </label>
              <input
                type="text"
                placeholder="15,000"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Slug{" "}
              <span className="font-normal text-slate-400">
                (optional — auto-generated from title if left blank)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. wordpress"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Background Image (home accordion + services page cards)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
              <input
                type="url"
                placeholder="https://…/service-bg.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputClass}
              />
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer hover:bg-[#004d4d]/10 dark:hover:bg-cyan-500/10 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    void handleUpload(e.target.files?.[0] || null);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {imageUrl ? (
              <div className="relative w-full max-w-sm h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Service background preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Add a background image for the homepage services accordion. Falls back to a default if empty.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Overview Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the architectural capabilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Features (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Sub-50ms SLA, Turbopack, Edge Streaming"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tech Stack Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Next.js 16, React 19, TypeScript"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deliverables (One Per Line)
            </label>
            <textarea
              rows={4}
              placeholder={
                "Production-ready codebase & repository\nDesign system & component library\n30-day post-launch warranty"
              }
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingService ? "Save Service Changes" : "Create Service Pillar"}
            </button>
            {editingService && (
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  resetForm();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      <div className="space-y-4">
        {services.map((service) => (
          <GlowCard
            key={service.id}
            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex gap-4 items-start max-w-2xl">
              {service.imageUrl ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold uppercase">
                    {service.estimatedWeeks} Weeks Sprint
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                    {service.basePrice}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  /services/{service.slug || service.id}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEditClick(service)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => void handleDelete(service.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                aria-label="Delete Service"
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
