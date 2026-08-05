"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import type { Project } from "@/data/projects";
import { ExternalLink, Play, Globe2, Sparkles } from "lucide-react";

function openLive(url?: string) {
  if (!url) return;
  window.setTimeout(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, 220);
}

function LiveProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 180, damping: 18 });
  const springY = useSpring(my, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const onMove = (e: React.MouseEvent) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    cardRef.current.style.setProperty("--mouse-x", `${px * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${py * 100}%`);
  };

  const onLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  const tall = index % 5 === 0 || index % 5 === 3;

  return (
    <motion.button
      type="button"
      ref={cardRef}
      onClick={() => openLive(project.demoUrl)}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      initial={reduceMotion ? false : { opacity: 0, y: 60, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.85,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 1100,
      }}
      className={`group relative w-full text-left rounded-3xl overflow-hidden border border-slate-300/70 dark:border-slate-700/80 bg-slate-950 shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        tall
          ? "min-h-[340px] sm:min-h-[420px] lg:row-span-2 lg:min-h-full"
          : "min-h-[280px] sm:min-h-[300px]"
      } ${project.demoUrl ? "cursor-pointer" : "cursor-default"}`}
      aria-label={
        project.demoUrl
          ? `Open live project ${project.title}`
          : project.title
      }
    >
      <div className="absolute inset-0">
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            poster={project.image || undefined}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-top scale-105 transition-transform duration-700 group-hover:scale-110"
          />
        ) : project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover object-top scale-105 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d] via-slate-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      </div>

      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(520px_circle_at_var(--mouse-x,50%)_var(--mouse-y,40%),rgba(34,211,238,0.22),transparent_50%)]" />
      )}

      <AnimatePresence>
        {hovered && !reduceMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="pointer-events-none absolute inset-3 rounded-2xl border border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
              {project.category}
            </span>
            {project.videoUrl && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                <Play className="w-3 h-3 fill-current" /> Video
              </span>
            )}
            {project.demoUrl && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                <Globe2 className="w-3 h-3" /> Live
              </span>
            )}
          </div>
          {project.demoUrl && (
            <span className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-[#004d4d] transition-all">
              <ExternalLink className="w-4 h-4" />
            </span>
          )}
        </div>

        <div className="space-y-2 mt-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300/90">
            {project.client || "Live Build"}
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {project.title}
          </h3>
          {(project.tagline || project.description) && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {project.tagline || project.description}
            </p>
          )}
          <div className="pt-2 text-[11px] font-semibold text-cyan-200/90 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            {project.demoUrl ? "Open live project" : "Live URL not set"}
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

interface LiveProjectsShowcaseProps {
  projects: Project[];
}

export const LiveProjectsShowcase: React.FC<LiveProjectsShowcaseProps> = ({
  projects,
}) => {
  const reduceMotion = useReducedMotion();

  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-sm text-slate-500">
        No live projects yet. In Admin → Projects, add image/video + live URL and
        enable &quot;Show in Live Projects&quot;.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-64 bg-[radial-gradient(ellipse_at_center,rgba(0,77,77,0.18),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_65%)]" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#004d4d]/30 dark:border-cyan-500/30 bg-white/70 dark:bg-slate-950/50 backdrop-blur text-[11px] font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-300"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Click any card to open the live host
      </motion.div>

      <div
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:auto-rows-[minmax(280px,auto)]"
        style={{ perspective: 1200 }}
      >
        {projects.map((project, index) => (
          <LiveProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};
