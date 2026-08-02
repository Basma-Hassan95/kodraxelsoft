"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ExternalLink,
  Play,
  Sparkles,
} from "lucide-react";

function ProjectMedia({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] overflow-hidden rounded-2xl border border-slate-300/80 dark:border-slate-700/80 bg-slate-950">
      {project.videoUrl ? (
        <video
          key={project.videoUrl}
          src={project.videoUrl}
          poster={project.image || undefined}
          muted
          loop
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.title}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d] to-slate-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <span className="px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
          {project.category}
        </span>
        {project.videoUrl && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
            <Play className="w-3 h-3 fill-current" /> Video
          </span>
        )}
      </div>

      {project.year && (
        <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/15">
          {project.year}
        </span>
      )}
    </div>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [40, -40]
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0.15, 0.45, 0.15]
  );

  const reverse = index % 2 === 1;
  const openLive = () => {
    if (!project.demoUrl) return;
    window.setTimeout(() => {
      window.open(project.demoUrl, "_blank", "noopener,noreferrer");
    }, 280);
  };

  return (
    <motion.article
      ref={rowRef}
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className="relative"
    >
      <motion.div
        style={{ opacity: glowOpacity }}
        className={`pointer-events-none absolute ${
          reverse ? "right-0" : "left-0"
        } top-1/2 -translate-y-1/2 w-[55%] h-[70%] rounded-full bg-[#004d4d]/25 dark:bg-cyan-500/15 blur-[80px]`}
      />

      <div
        className={`relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        <motion.div
          style={{ y: mediaY }}
          className={`lg:col-span-7 group ${reverse ? "lg:[direction:ltr]" : ""}`}
        >
          <ProjectMedia project={project} priority={index === 0} />
        </motion.div>

        <div
          className={`lg:col-span-5 space-y-4 ${
            reverse ? "lg:[direction:ltr]" : ""
          }`}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: reverse ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{project.client || "Featured Client"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h3>

            {project.tagline && (
              <p className="text-sm font-semibold text-[#004d4d]/90 dark:text-cyan-300/90">
                {project.tagline}
              </p>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {project.description}
            </p>

            {project.impactMetrics?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-100/80 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
                {project.impactMetrics.slice(0, 3).map((metric, mIdx) => (
                  <div key={mIdx} className="text-center">
                    <div className="text-sm font-extrabold text-[#004d4d] dark:text-cyan-400">
                      {metric.value}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-slate-200/80 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {project.demoUrl ? (
                <Button
                  variant="teal-gradient"
                  size="md"
                  icon={<ExternalLink className="w-4 h-4" />}
                  onClick={openLive}
                >
                  Open Live Project
                </Button>
              ) : null}
              <Link href={`/portfolio#${project.id}`}>
                <Button
                  variant={project.demoUrl ? "outline" : "teal-gradient"}
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Full Case Study
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

interface ProjectsShowcaseProps {
  projects: Project[];
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  projects,
}) => {
  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-sm text-slate-500">
        No featured projects yet. Mark projects as featured in Admin → Projects.
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {projects.map((project, index) => (
        <ProjectRow key={project.id} project={project} index={index} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="flex justify-center"
      >
        <Link href="/portfolio">
          <Button
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Browse Full Portfolio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
