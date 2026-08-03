"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicProjects } from "@/hooks/usePublicCms";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  const projectsData = usePublicProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "SaaS & Web Apps",
    "AI & Machine Learning",
    "Fintech",
    "Enterprise Systems",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
      <SectionHeader
        badgeText="Selected Case Studies"
        title="Engineered Products & Proven"
        gradientTitle="Business Impact"
        subtitle="Explore our portfolio of high-scale Next.js platforms, AI engines, and enterprise systems. Click any case study for the full breakdown."
      />

      <GSAPReveal direction="up">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#226263] text-white shadow-md border border-[#226263]/40"
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
              <Link href={`/portfolio/${project.id}`} className="block">
                <div className="relative w-full h-52 rounded-xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800 bg-slate-950">
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      poster={project.image || undefined}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                    {project.category}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider mb-1">
                  {project.client}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                {project.tagline && (
                  <p className="text-[11px] font-semibold text-[#004d4d]/80 dark:text-cyan-400/80 mb-2">
                    {project.tagline}
                  </p>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </Link>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 mb-4">
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

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">
                {project.year}
              </span>
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
                    Live
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
