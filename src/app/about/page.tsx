"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { TechSphere3D } from "@/components/ui/TechSphere3D";
import { ShieldCheck, ArrowRight, Cpu, Code2, Users, Layers, Zap, Globe, Terminal } from "lucide-react";

export default function AboutPage() {
  const pillars = [
    {
      title: "Direct Principal Engineering",
      subtitle: "Zero Handoffs",
      description: "You partner directly with senior principal architects. No account managers, no junior developers, and zero lost context.",
      icon: Users
    },
    {
      title: "Sub-50ms Edge Performance",
      subtitle: "Zero Bottlenecks",
      description: "Performance speed is our primary architecture constraint. Every system is built to render sub-second globally.",
      icon: Cpu
    },
    {
      title: "Strict Zero Tech Debt",
      subtitle: "Clean Code",
      description: "We enforce strict TypeScript schemas, automated testing, and clean modular microservices from line one of code.",
      icon: Code2
    },
    {
      title: "Transparent SLA Guarantees",
      subtitle: "Fixed Timelines",
      description: "Fixed-scope deliverables backed by a 100/100 Lighthouse benchmark guarantee and 30-day post-launch code warranty.",
      icon: ShieldCheck
    }
  ];

  const milestones = [
    { year: "2023", title: "Laboratory Founded", desc: "Established as an agile software architecture studio specializing in high-performance WebGL & Next.js." },
    { year: "2024", title: "Enterprise Scaling", desc: "Architected sub-50ms edge platforms processing 5M+ daily requests for fintech and healthcare leaders." },
    { year: "2025", title: "AI Multi-Agent Engines", desc: "Deployed autonomous RAG vector pipelines and domain LLMs for Fortune 500 enterprises." },
    { year: "2026", title: "Global Expansion", desc: "Scaling high-availability multi-region cloud infrastructures across North America and Europe." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
      
      {/* Hero Header */}
      <SectionHeader
        badgeText="About Kodraxelsoft"
        title="Ultra-Premium Engineering Laboratory &"
        gradientTitle="Architectural Innovators"
        subtitle="Kodraxelsoft was established to eliminate agency overhead. We operate as an elite team of principal software architects delivering production-ready platforms for market leaders."
      />

      {/* 3D WebGL Neural Globe & Studio Vision Hero Banner */}
      <GSAPReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-2xl overflow-hidden relative">
          
          <div className="lg:col-span-6 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>3D Interactive Architecture</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Architecting the Future of Web & AI Infrastructure
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We combine cutting-edge 3D WebGL motion physics, Next.js App Router edge streaming, and custom PyTorch machine learning pipelines into seamless enterprise products.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Zap className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                <span>100/100 Lighthouse SLA</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Globe className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                <span>Global Multi-Region Cloud</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D WebGL Tech Sphere Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <TechSphere3D />
          </div>

        </div>
      </GSAPReveal>

      {/* Engineering Pillars Grid */}
      <section className="space-y-12">
        <SectionHeader
          badgeText="Our Manifesto"
          title="The Core Pillars of Our"
          gradientTitle="Engineering Philosophy"
          subtitle="Why market leaders trust Kodraxelsoft to design, build, and scale their most critical software platforms."
        />

        <GSAPReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <GlowCard key={idx} className="p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#004d4d]/10 border border-[#006666]/30 flex items-center justify-center text-[#004d4d] dark:text-cyan-400 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                  {p.subtitle}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</p>
              </GlowCard>
            );
          })}
        </GSAPReveal>
      </section>

      {/* Studio Growth Milestones */}
      <section className="space-y-12">
        <SectionHeader
          badgeText="Milestones"
          title="Our Journey of"
          gradientTitle="Continuous Engineering Innovation"
          subtitle="Key milestones in our laboratory's growth and technological evolution."
        />

        <GSAPReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <GlowCard key={idx} className="p-6 h-full">
              <div className="text-3xl font-extrabold text-[#004d4d] dark:text-cyan-400 mb-2">{m.year}</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{m.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{m.desc}</p>
            </GlowCard>
          ))}
        </GSAPReveal>
      </section>

      {/* CTA */}
      <section className="text-center pt-8">
        <Button
          variant="teal-gradient"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          onClick={() => (window.location.href = "/contact")}
        >
          Book Technical Discovery Call
        </Button>
      </section>

    </div>
  );
}
