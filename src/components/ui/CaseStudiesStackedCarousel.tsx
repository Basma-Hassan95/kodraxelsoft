"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Play,
  ExternalLink,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

interface CaseStudiesStackedCarouselProps {
  projects: Project[];
}

export const CaseStudiesStackedCarousel: React.FC<
  CaseStudiesStackedCarouselProps
> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const { ref: cardRef, inView: cardInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const cardsCount = projects.length;

  useEffect(() => {
    if (cardsCount < 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardsCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [cardsCount]);

  useEffect(() => {
    if (activeIndex >= cardsCount && cardsCount > 0) setActiveIndex(0);
  }, [cardsCount, activeIndex]);

  if (!projects.length) return null;

  const active = projects[activeIndex] || projects[0];

  return (
    <div className="w-full relative py-4 isolate z-10">
      {/* Desktop & Tablet stacked carousel */}
      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate={cardInView ? "visible" : "hidden"}
        className="hidden sm:flex relative items-center justify-center h-[560px] sm:h-[520px]"
      >
        {projects.map((card, i) => {
          const offset = (i - activeIndex + cardsCount) % cardsCount;
          let scale = 1 - offset * 0.07;
          let translateY = -offset * 36;
          const zIndex = 20 - offset * 4;
          const opacity = offset > 2 ? 0.35 : 1 - offset * 0.15;

          if (hovered === i && offset > 0) {
            translateY = translateY - 18;
            scale = scale + 0.03;
          }

          return (
            <motion.div
              key={card.id}
              variants={cardVariant}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActiveIndex(i)}
              className="absolute rounded-3xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-[900px] cursor-pointer"
              style={{ height: "460px", zIndex }}
              animate={{ scale, y: translateY, opacity }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#090d16]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                  <span>Case Study 0{i + 1}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004d4d]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100%-48px)]">
                <div className="relative h-44 md:h-full overflow-hidden bg-slate-950">
                  {card.videoUrl ? (
                    <video
                      src={card.videoUrl}
                      poster={card.image || undefined}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : card.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d] to-slate-900" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                      {card.category}
                    </span>
                    {card.videoUrl && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 text-[10px] font-bold text-white border border-white/20">
                        <Play className="w-3 h-3 fill-current" /> Video
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
                      {card.client}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {card.title}
                    </h3>
                    {card.tagline && (
                      <p className="text-xs font-semibold text-[#004d4d]/90 dark:text-cyan-300/90 line-clamp-1">
                        {card.tagline}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {(card.impactMetrics || []).slice(0, 4).map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                          <span className="truncate">
                            {feat.value} {feat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Year:{" "}
                      <span className="text-slate-900 dark:text-white font-bold">
                        {card.year || "—"}
                      </span>
                    </div>
                    <Link
                      href={`/portfolio/${card.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="teal-gradient"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        View Case Study
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="hidden sm:block text-center mt-6">
        <AnimatePresence mode="wait">
          <motion.h4
            key={active.id}
            className="inline-block text-sm font-semibold text-[#004d4d] dark:text-cyan-400 bg-white dark:bg-[#0B0F17] px-5 py-2 rounded-full border border-slate-300 dark:border-slate-800 shadow-md mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            Active: {active.title}
          </motion.h4>
        </AnimatePresence>

        <div className="flex justify-center gap-2.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Select case study ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                i === activeIndex
                  ? "w-8 bg-[#004d4d] dark:bg-cyan-400 shadow-md"
                  : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={cardInView ? "visible" : "hidden"}
        className="sm:hidden space-y-6"
      >
        {projects.map((card, i) => (
          <motion.div
            key={card.id}
            variants={cardVariant}
            className="rounded-2xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-slate-800 shadow-lg overflow-hidden"
          >
            <div className="relative h-44 bg-slate-950">
              {card.videoUrl ? (
                <video
                  src={card.videoUrl}
                  poster={card.image || undefined}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Case Study 0{i + 1}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {card.description}
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">{card.year}</span>
                <Link href={`/portfolio/${card.id}`}>
                  <Button
                    variant="teal-gradient"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Case Study
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="hidden sm:flex justify-center mt-8">
        <Link href="/portfolio">
          <Button variant="outline" size="md" icon={<ExternalLink className="w-4 h-4" />}>
            Browse All Case Studies
          </Button>
        </Link>
      </div>
    </div>
  );
};
