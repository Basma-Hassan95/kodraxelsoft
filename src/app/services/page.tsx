"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { servicesData } from "@/data/services";
import { usePublicServices } from "@/hooks/usePublicCms";
import { Code2, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function ServicesPage() {
  const servicesData = usePublicServices();
  const [isMuted, setIsMuted] = useState(true);

  const techStackList = [
    { category: "Frontend & Motion", techs: ["Next.js 16", "React 19", "TypeScript", "GSAP 3", "Tailwind CSS v4", "Three.js"] },
    { category: "AI & Machine Learning", techs: ["PyTorch", "Python", "LangChain", "Pinecone Vector DB", "FastAPI", "CUDA"] },
    { category: "Cloud & DevOps", techs: ["AWS / GCP", "Kubernetes", "Docker", "Terraform", "Vercel Enterprise", "Grafana"] },
    { category: "Databases & Backend", techs: ["PostgreSQL", "Redis", "Supabase", "GraphQL", "gRPC", "Prisma"] }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Capabilities & Architecture"
        title="Enterprise Engineering Services"
        gradientTitle="Tailored for Scale"
        subtitle="Direct technical execution with zero layers of management. Partner directly with our principal architects to architect high-performance platforms."
      />

      {/* 3D Glassmorphic AI Capabilities Video Showcase Banner (Video 1) */}
      <GSAPReveal direction="up">
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden relative group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI Capability Motion Reveal</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Autonomous AI Neural Graphics & Cloud Motion
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Experience our live AI capability engine rendering next-generation brand graphics, vector AI models, and real-time WebGL streaming.
            </p>
          </div>

          <div className="lg:col-span-6 relative w-full aspect-video sm:h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center">
            <video
              src="/video1.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

        </div>
      </GSAPReveal>

      {/* Service Pillars Detailed Grid */}
      <div className="space-y-16 py-4">
        {servicesData.map((service, idx) => (
          <GSAPReveal key={service.id} direction="up" delay={idx * 0.1}>
            <div className="service-card-3d grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl relative overflow-visible">
              
              {/* Left Column: Description & Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Pillar 0{idx + 1}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{service.title}</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-2">
                  {service.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#004d4d] dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Architecture & SLA Guarantees Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                      <span>SLA Guarantee</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold">
                      {service.estimatedWeeks} Sprint
                    </span>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mt-5 mb-3">
                    Guaranteed Deliverables:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    {service.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="teal-gradient"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => (window.location.href = `/contact?service=${service.id}`)}
                  className="w-full justify-center"
                >
                  Inquire About {service.title.split("&")[0]}
                </Button>
              </div>

            </div>
          </GSAPReveal>
        ))}
      </div>

      {/* Technology Stack Matrix */}
      <section className="pt-12">
        <SectionHeader
          badgeText="Tech Stack Matrix"
          title="Battle-Tested Technologies for"
          gradientTitle="Modern Enterprise Apps"
          subtitle="We select tools with proven long-term support, performance speed, and rich developer ecosystems."
        />

        <GSAPReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStackList.map((stack, idx) => (
            <GlowCard key={idx} className="h-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                {stack.category}
              </h3>
              <ul className="space-y-2">
                {stack.techs.map((t, tIdx) => (
                  <li key={tIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          ))}
        </GSAPReveal>
      </section>

    </div>
  );
}
