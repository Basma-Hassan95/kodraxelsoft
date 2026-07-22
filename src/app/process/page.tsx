"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { processSteps } from "@/data/process";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Users, Zap } from "lucide-react";

export default function ProcessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
      
      {/* Header */}
      <GSAPReveal direction="down">
        <SectionHeader
          badgeText="Agile Framework"
          title="Our 6-Stage Client Onboarding &"
          gradientTitle="Development Lifecycle"
          subtitle="How our 4 founders take your product from initial architectural discovery to a sub-50ms production edge launch."
        />
      </GSAPReveal>

      {/* 6-Stage Timeline List */}
      <div className="space-y-12 relative">
        {/* Connecting Vertical Axis Line for Desktop */}
        <div className="hidden lg:block absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-teal-500 to-sky-500 opacity-30" />

        {processSteps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <GSAPReveal key={step.stepNumber} direction={isEven ? "left" : "right"} delay={idx * 0.1}>
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
                
                {/* Step Card */}
                <div className={`lg:col-span-12`}>
                  <GlowCard className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-xl shrink-0">
                          {step.stepNumber}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{step.subtitle}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{step.duration}</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{step.founderOwner.split("(")[0]}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-7">
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      <div className="md:col-span-5 p-4 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                          Key Stage Deliverables:
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          {step.keyDeliverables.map((del, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlowCard>
                </div>

              </div>
            </GSAPReveal>
          );
        })}
      </div>

      {/* SLA Guarantees Banner */}
      <section className="pt-12">
        <GSAPReveal direction="up">
          <div className="p-8 md:p-12 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-teal-950/50 via-[#111726] to-cyan-950/50 text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Our Enterprise SLA Guarantee</h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every project comes signed with our 100/100 Lighthouse performance guarantee, 30-day post-launch code warranty, and direct founder support.
            </p>
            <Button
              variant="teal-gradient"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => (window.location.href = "/contact")}
            >
              Start Your Onboarding
            </Button>
          </div>
        </GSAPReveal>
      </section>

    </div>
  );
}
