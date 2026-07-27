"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Service } from "@/data/services";
import { Layers, Plus, Trash2, Edit3, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weeks, setWeeks] = useState("4");
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featureInput ? featureInput.split(",").map((f) => f.trim()) : ["Sub-50ms SLA"];
    const technologies = techInput ? techInput.split(",").map((t) => t.trim()) : ["Next.js 16", "TypeScript"];

    if (editingService) {
      updateService({
        ...editingService,
        title,
        description,
        estimatedWeeks: String(weeks),
        features,
        technologies
      });
      setEditingService(null);
    } else {
      addService({
        id: `service-${Date.now()}`,
        iconName: "Code",
        title,
        subtitle: title,
        description,
        basePrice: "$15,000",
        estimatedWeeks: String(weeks),
        features,
        technologies,
        deliverables: ["Production Edge Deployment", "Full Source Code"]
      });
    }

    setTitle("");
    setDescription("");
    setWeeks("4");
    setFeatureInput("");
    setTechInput("");
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setWeeks(service.estimatedWeeks);
    setFeatureInput(service.features.join(", "));
    setTechInput(service.technologies.join(", "));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Services & Capabilities Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add, edit, or delete core engineering pillars, features, SLA guarantees, and tech stacks dynamically.
        </p>
      </div>

      {/* Service Editor Form */}
      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{editingService ? `Edit Service: ${editingService.title}` : "Create New Engineering Service Pillar"}</span>
        </h3>

        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js 16 Edge Architecture"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sprint Duration (e.g. 3-4 Weeks)</label>
              <input
                type="text"
                required
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Overview Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the architectural capabilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Features (Comma Separated)</label>
              <input
                type="text"
                placeholder="Sub-50ms SLA, Turbopack, Edge Streaming"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="Next.js 16, React 19, TypeScript"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingService ? "Save Service Changes" : "Create Service Pillar"}
            </button>
            {editingService && (
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {/* Services List Table */}
      <div className="space-y-4">
        {services.map((service) => (
          <GlowCard key={service.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold uppercase">
                  {service.estimatedWeeks} Weeks Sprint
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {service.technologies.map((tech, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
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
                onClick={() => deleteService(service.id)}
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
