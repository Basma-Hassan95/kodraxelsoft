"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { processSteps } from "@/data/process";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProcessPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 40%"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-[#004d4d]/10 blur-[120px]" />

      <SectionHeader
        badgeText="Delivery Process"
        title="How We Turn Your Idea into a"
        gradientTitle="Live Digital Product"
        subtitle="A simple 6-stage journey to build your custom software. Clear steps, fixed timelines, and total peace of mind every step of the way."
      />

      <div ref={trackRef} className="relative max-w-3xl mx-auto">
        {/* Progress rail */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800">
          <motion.div
            style={{ height: progressHeight }}
            className="w-full origin-top bg-gradient-to-b from-[#004d4d] via-[#006666] to-cyan-400"
          />
        </div>

        <div className="space-y-8 sm:space-y-10">
          {processSteps.map((step, idx) => (
            <motion.article
              key={step.stepNumber}
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: 0.04, ease }}
              className="relative pl-14 sm:pl-20"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="absolute left-1.5 sm:left-3.5 top-5 w-6 h-6 rounded-full border-2 border-[#004d4d] dark:border-cyan-400 bg-white dark:bg-[#090d16] flex items-center justify-center shadow-[0_0_0_4px_rgba(0,77,77,0.12)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#004d4d] dark:bg-cyan-400" />
              </motion.div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111726]/90 backdrop-blur-sm p-6 sm:p-7 shadow-sm hover:border-[#004d4d]/40 dark:hover:border-cyan-500/40 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#004d4d] dark:text-cyan-400">
                    Stage {step.stepNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#004d4d] dark:text-cyan-400">
                  {step.subtitle}
                </p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.keyDeliverables.map((del) => (
                    <li
                      key={del}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                      {del}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="p-8 md:p-12 rounded-3xl border border-[#006666]/40 bg-[#0c1424] text-center space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-white">Ready for Stage One?</h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Book a free discovery call today. We will map out your scope, timeline, and exact cost before you spend a single dollar.
        </p>
        <Button
          variant="teal-gradient"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          onClick={() => (window.location.href = "/contact")}
        >
          Start Your Project Now
        </Button>
      </motion.div>
    </div>
  );
}
