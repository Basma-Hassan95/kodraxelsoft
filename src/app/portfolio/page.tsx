"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { projectsData, Project } from "@/data/projects";
import { usePublicProjects } from "@/hooks/usePublicCms";
import { ExternalLink, Filter, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  const projectsData = usePublicProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ["All", "SaaS & Web Apps", "AI & Machine Learning", "Fintech", "Enterprise Systems"];

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Selected Case Studies"
        title="Engineered Products & Proven"
        gradientTitle="Business Impact"
        subtitle="Explore our portfolio of high-scale Next.js platforms, AI engines, and enterprise systems built for global startups and Fortune 500 partners."
      />

      {/* Category Filter Tabs */}
      <GSAPReveal direction="up">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#004d4d] text-white shadow-md border border-[#006666]/40"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GSAPReveal>

      {/* Staggered Portfolio Grid */}
      <GSAPReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <GlowCard key={project.id} className="h-full flex flex-col justify-between p-6">
            <div>
              <div className="relative w-full h-52 rounded-xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                  {project.category}
                </div>
              </div>

              <div className="text-[11px] font-semibold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider mb-1">
                {project.client}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 mb-4">
                {project.impactMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="text-center">
                    <div className="text-xs font-extrabold text-[#004d4d] dark:text-cyan-400">{metric.value}</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{project.year}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalProject(project)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Read Breakdown
              </Button>
            </div>
          </GlowCard>
        ))}
      </GSAPReveal>

      {/* Case Study Detail Modal */}
      {activeModalProject && (
        <Modal
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
          title={activeModalProject.title}
        >
          <div className="space-y-6">
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400">
                {activeModalProject.client} • {activeModalProject.category}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {activeModalProject.description}
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
                The Engineering Challenge:
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300">{activeModalProject.challenge}</p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 pt-2">
                Kodraxelsoft Solution:
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300">{activeModalProject.solution}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
                Tech Stack Implemented:
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalProject.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setActiveModalProject(null)}>
                Close
              </Button>
              <Button
                variant="teal-gradient"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => window.open(activeModalProject.demoUrl || "https://example.com", "_blank")}
              >
                Live Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
