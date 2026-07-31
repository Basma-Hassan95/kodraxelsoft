"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Service } from "@/data/services";
import { usePublicServices } from "@/hooks/usePublicCms";
import { Button } from "@/components/ui/Button";
import { Code2, CheckCircle2, ArrowRight } from "lucide-react";

// Framer Motion entrance variants
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

export const CapabilitiesStackedCarousel: React.FC = () => {
  const services = usePublicServices();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const { ref: cardRef, inView: cardInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const cardsCount = services.length;

  // Auto-slide every 5 seconds for desktop/tablet
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

  if (!services.length) return null;

  return (
    <div className="w-full relative py-4 isolate z-10">
      {/* --- Desktop & Tablet Stacked 3D Carousel (>= 640px) --- */}
      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate={cardInView ? "visible" : "hidden"}
        className="hidden sm:flex relative items-center justify-center h-[520px] sm:h-[480px]"
      >
        {services.map((card: Service, i: number) => {
          // Calculate offset position relative to active index
          const offset = (i - activeIndex + cardsCount) % cardsCount;

          // Stacking scaling, translateY, zIndex, and opacity
          let scale = 1 - offset * 0.07;
          let translateY = -offset * 36;
          const zIndex = 20 - offset * 4;
          const opacity = offset > 2 ? 0.4 : 1 - offset * 0.15;

          // Hover lift effect on stacked background cards
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
              className="absolute rounded-3xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-[850px] cursor-pointer"
              style={{ height: "420px", zIndex }}
              animate={{ scale, y: translateY, opacity }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Terminal / Browser Bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#090d16]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                  <span>Capability Pillar 0{i + 1}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004d4d]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between h-[calc(100%-48px)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold shrink-0">
                      {card.subtitle}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {card.description}
                  </p>

                  {/* 4 Feature Bullets List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {card.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Bar: Timeline & CTA Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Est. Timeline:{" "}
                    <span className="text-slate-900 dark:text-white font-bold">
                      {card.estimatedWeeks}
                    </span>
                  </div>

                  <Link href="/services" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Service Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination & Dynamic Pillar Heading (Desktop/Tablet) */}
      <div className="hidden sm:block text-center mt-6">
        <AnimatePresence mode="wait">
          <motion.h4
            key={services[activeIndex].title}
            className="inline-block text-sm font-semibold text-[#004d4d] dark:text-cyan-400 bg-white dark:bg-[#0B0F17] px-5 py-2 rounded-full border border-slate-300 dark:border-slate-800 shadow-md mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            Active: {services[activeIndex].title}
          </motion.h4>
        </AnimatePresence>

        {/* 4 Interactive Dot Indicators */}
        <div className="flex justify-center gap-2.5">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Select pillar ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                i === activeIndex
                  ? "w-8 bg-[#004d4d] dark:bg-cyan-400 shadow-md"
                  : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- Mobile Fallback Static List (< 640px) --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={cardInView ? "visible" : "hidden"}
        className="sm:hidden space-y-6"
      >
        {services.map((card: Service, i: number) => (
          <motion.div
            key={card.id}
            variants={cardVariant}
            className="rounded-2xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-slate-800 shadow-lg overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Pillar 0{i + 1}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {card.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {card.description}
            </p>

            <div className="space-y-2">
              {card.features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Timeline: <span className="font-bold text-slate-900 dark:text-white">{card.estimatedWeeks}</span>
              </div>
              <Link href="/services">
                <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Details
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
