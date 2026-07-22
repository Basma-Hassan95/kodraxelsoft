"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { EstimatorModal } from "@/components/ui/EstimatorModal";
import { servicesData } from "@/data/services";
import { Code2, Cpu, Layers, Zap, CheckCircle2, Calculator, ArrowRight, ShieldCheck } from "lucide-react";

export default function ServicesPage() {
  const [estimatorOpen, setEstimatorOpen] = useState(false);

  const techStackList = [
    { category: "Frontend & Motion", techs: ["Next.js 16", "React 19", "TypeScript", "GSAP 3", "Tailwind CSS v4", "Three.js"] },
    { category: "AI & Machine Learning", techs: ["PyTorch", "Python", "LangChain", "Pinecone Vector DB", "FastAPI", "CUDA"] },
    { category: "Cloud & DevOps", techs: ["AWS / GCP", "Kubernetes", "Docker", "Terraform", "Vercel Enterprise", "Grafana"] },
    { category: "Databases & Backend", techs: ["PostgreSQL", "Redis", "Supabase", "GraphQL", "gRPC", "Prisma"] }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      
      {/* Header */}
      <GSAPReveal direction="down">
        <SectionHeader
          badgeText="Capabilities & Pricing"
          title="Enterprise Engineering Services"
          gradientTitle="Tailored for Scale"
          subtitle="Direct technical execution with zero layers of management. Choose your architecture pillar below or calculate a custom project scope."
        />
      </GSAPReveal>

      {/* Estimator Launcher Banner */}
      <GSAPReveal direction="up">
        <div className="p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-teal-950/40 via-[#111726] to-cyan-950/40 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Custom Project Estimator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Select add-on modules, security features, and delivery speeds to view live estimates.</p>
            </div>
          </div>
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setEstimatorOpen(true)}
          >
            Launch Interactive Estimator
          </Button>
        </div>
      </GSAPReveal>

      {/* Service Pillars Detailed Grid */}
      <div className="space-y-16">
        {servicesData.map((service, idx) => (
          <GSAPReveal key={service.id} direction="up" delay={idx * 0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl relative overflow-hidden">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Pillar {idx + 1}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{service.title}</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-2">
                  {service.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Deliverables Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    Starting Investment
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
                    <span>{service.basePrice}</span>
                    <span className="text-xs font-normal text-cyan-600 dark:text-cyan-400">({service.estimatedWeeks})</span>
                  </div>
                  
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mt-6 mb-3">
                    Guaranteed Deliverables:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {service.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
                  Book {service.title.split("&")[0]}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStackList.map((stack, idx) => (
            <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
              <GlowCard className="h-full">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  {stack.category}
                </h3>
                <ul className="space-y-2">
                  {stack.techs.map((t, tIdx) => (
                    <li key={tIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </GSAPReveal>
          ))}
        </div>
      </section>

      <EstimatorModal isOpen={estimatorOpen} onClose={() => setEstimatorOpen(false)} />
    </div>
  );
}
