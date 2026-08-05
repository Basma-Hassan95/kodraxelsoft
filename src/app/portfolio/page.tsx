"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicProjects } from "@/hooks/usePublicCms";
import { projectsData as localProjects } from "@/data/projects";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ScrollPreviewImage } from "@/components/ui/ScrollPreviewImage";

export default function PortfolioPage() {
  const cmsProjects = usePublicProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const projectsData = [
    ...localProjects,
    ...cmsProjects.filter(
      (c) =>
        !localProjects.some(
          (local) =>
            local.id === c.id ||
            (local.demoUrl && c.demoUrl === local.demoUrl)
        )
    ),
  ];

  const categories = [
    "All",
    "Websites & Apps",
    "AI & Smart Automation",
    "Finance & Security",
    "Business Systems",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
      <SectionHeader
        badgeText="SELECTED CASE STUDIES"
        title="Real Software Projects Built for"
        gradientTitle="Business Growth"
        subtitle="Explore our portfolio of fast custom websites, smart AI helpers, and business software. Click any case study to see how we helped our clients win."
      />

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

      <GSAPReveal
        stagger={0.08}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map((project) => (
          <GlowCard
            key={project.id}
            id={project.id}
            className="h-full flex flex-col justify-between p-6 scroll-mt-28"
          >
            <div>
              <div className="relative mb-5">
                {project.videoUrl ? (
                  <Link href={`/portfolio/${project.id}`} className="block">
                    <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                      <video
                        src={project.videoUrl}
                        poster={project.image || undefined}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                ) : project.scrollPreview ? (
                  <ScrollPreviewImage
                    src={project.image}
                    alt={project.title}
                  />
                ) : (
                  <Link href={`/portfolio/${project.id}`} className="block">
                    <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                  {project.category}
                </div>
              </div>

              <Link href={`/portfolio/${project.id}`} className="block">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                {project.tagline && (
                  <p className="text-[11px] font-semibold text-[#004d4d]/80 dark:text-cyan-400/80 mb-2">
                    {project.tagline}
                  </p>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </Link>

              <div
                className={`grid gap-2 p-3 rounded-lg bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 mb-4 ${
                  project.impactMetrics.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
                }`}
              >
                {project.impactMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="text-center">
                    <div className="text-xs font-extrabold text-[#004d4d] dark:text-cyan-400">
                      {metric.value}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <div className="flex gap-2">
                {project.demoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        project.demoUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Live Demo
                  </Button>
                )}
                <Link href={`/portfolio/${project.id}`}>
                  <Button
                    variant="teal-gradient"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Case Study
                  </Button>
                </Link>
              </div>
            </div>
          </GlowCard>
        ))}
      </GSAPReveal>
    </div>
  );
}
