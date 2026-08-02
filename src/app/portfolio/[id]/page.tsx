"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicProjects } from "@/hooks/usePublicCms";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Play,
  ShieldCheck,
  Sparkles,
  Briefcase,
} from "lucide-react";

export default function CaseStudyDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const projects = usePublicProjects();

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Case Study Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We couldn&apos;t find a case study matching this link. It may have been
          renamed or removed.
        </p>
        <Link href="/portfolio">
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  const openLive = () => {
    if (!project.demoUrl) return;
    window.open(project.demoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Case Studies</span>
      </Link>

      <GSAPReveal direction="up">
        <div className="relative rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-950 min-h-[280px] sm:min-h-[420px]">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.image || undefined}
              muted
              loop
              autoPlay
              playsInline
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d] to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                {project.category}
              </span>
              {project.videoUrl && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold border border-white/20">
                  <Play className="w-3 h-3 fill-current" /> Video Case Study
                </span>
              )}
              {project.year && (
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold border border-white/15">
                  {project.year}
                </span>
              )}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-300/90">
              {project.client}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl">
              {project.title}
            </h1>
            {project.tagline && (
              <p className="text-base sm:text-lg text-slate-200 max-w-3xl">
                {project.tagline}
              </p>
            )}
          </div>
        </div>
      </GSAPReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-10">
          <GSAPReveal direction="up">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                Overview
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </div>
          </GSAPReveal>

          {project.challenge && (
            <GSAPReveal direction="up">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Challenge
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            </GSAPReveal>
          )}

          {project.solution && (
            <GSAPReveal direction="up">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Solution
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </GSAPReveal>
          )}

          {project.technologies?.length > 0 && (
            <GSAPReveal direction="up">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#004d4d] dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </GSAPReveal>
          )}
        </div>

        <GSAPReveal direction="right" className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <GlowCard className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
              Impact Metrics
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(project.impactMetrics || []).map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800"
                >
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {metric.label}
                  </span>
                  <span className="text-base font-extrabold text-[#004d4d] dark:text-cyan-400">
                    {metric.value}
                  </span>
                </div>
              ))}
              {!project.impactMetrics?.length && (
                <p className="text-xs text-slate-500">Metrics coming soon.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                Production delivery with post-launch support
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                Client: {project.client || "Confidential"}
              </div>
            </div>

            {project.demoUrl && (
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ExternalLink className="w-4 h-4" />}
                className="w-full justify-center"
                onClick={openLive}
              >
                Open Live Project
              </Button>
            )}
            <Link href="/contact?serviceName=Case%20Study%20Inquiry" className="block">
              <Button
                variant="outline"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Start a Similar Project
              </Button>
            </Link>
          </GlowCard>
        </GSAPReveal>
      </div>

      <GSAPReveal direction="up">
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Want results like {project.title.split("-")[0].trim()}?
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Talk to our architects about scope, timeline, and a fixed-price engagement.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Contact Us
            </Button>
          </Link>
        </div>
      </GSAPReveal>
    </div>
  );
}
