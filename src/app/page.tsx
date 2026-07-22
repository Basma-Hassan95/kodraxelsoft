"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { EstimatorModal } from "@/components/ui/EstimatorModal";
import { foundersData } from "@/data/founders";
import { servicesData } from "@/data/services";
import { projectsData } from "@/data/projects";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
  ExternalLink,
  Star,
  Calculator
} from "lucide-react";

export default function HomePage() {
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const featuredProjects = projectsData.filter((p) => p.featured);

  return (
    <div className="space-y-24 md:space-y-36 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-28 overflow-hidden bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <GSAPReveal direction="down">
            <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs font-medium uppercase tracking-wider mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>• Elite Engineering Studio • Next-Gen AI & Web Platforms</span>
            </div>
          </GSAPReveal>

          {/* High Contrast Hero Headline */}
          <GSAPReveal direction="up" delay={0.1}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-5xl mx-auto">
              <span className="text-slate-900 dark:text-white drop-shadow-sm">
                Engineering High-Scale Web Apps &{" "}
              </span>
              <span className="text-gradient-teal drop-shadow-md">
                Autonomous AI Systems
              </span>
            </h1>
          </GSAPReveal>

          {/* Subtitle with High Contrast Slate Text */}
          <GSAPReveal direction="up" delay={0.2}>
            <p className="mt-6 text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Kodraxelsoft is an elite corporate engineering studio. We partner with visionaries to build sub-50ms Next.js web platforms, custom machine learning pipelines, and cloud architectures.
            </p>
          </GSAPReveal>

          <GSAPReveal direction="up" delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => (window.location.href = "/contact")}
              >
                Start a Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Calculator className="w-5 h-5" />}
                onClick={() => setEstimatorOpen(true)}
              >
                Calculate Estimate
              </Button>
            </div>
          </GSAPReveal>

          {/* Hero Code / Dashboard Teaser Visual */}
          <GSAPReveal direction="up" delay={0.4} className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-[#111726]/90 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden group">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 px-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-600 dark:text-slate-300 font-semibold">kodraxelsoft-core-architecture.ts</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-4 bg-slate-950 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <div className="space-y-2">
                  <div className="text-cyan-400 font-bold">// 1. Next.js 16 Edge Stream</div>
                  <div className="text-slate-400">export async function GET() &#123;</div>
                  <div className="pl-4 text-emerald-400">const res = await edgeEngine.stream();</div>
                  <div className="pl-4 text-slate-400">return NextResponse.json(&#123; ttfb: &quot;12ms&quot; &#125;);</div>
                  <div className="text-slate-400">&#125;</div>
                </div>
                <div className="space-y-2">
                  <div className="text-cyan-400 font-bold">// 2. GSAP Motion Controller</div>
                  <div className="text-slate-400">gsap.to(&quot;.hero-glow&quot;, &#123;</div>
                  <div className="pl-4 text-sky-400">scale: 1.2, duration: 1.5,</div>
                  <div className="pl-4 text-amber-300">ease: &quot;power4.out&quot;</div>
                  <div className="text-slate-400">&#125;);</div>
                </div>
                <div className="space-y-2">
                  <div className="text-cyan-400 font-bold">// 3. PyTorch AI Vector RAG</div>
                  <div className="text-slate-400">const agent = new AgentCluster(&#123;</div>
                  <div className="pl-4 text-purple-400">model: &quot;kodraxel-v4-8bit&quot;,</div>
                  <div className="pl-4 text-emerald-400">latencySLA: &quot;&lt;10ms&quot;</div>
                  <div className="text-slate-400">&#125;);</div>
                </div>
              </div>
            </div>
          </GSAPReveal>

        </div>
      </section>

      {/* 2. STATS & METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
              <AnimatedCounter target={99.999} decimals={3} suffix="%" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Uptime SLA
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter target={4} suffix=" Principal" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Founding Engineers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
              <AnimatedCounter target={100} suffix="/100" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Lighthouse Performance
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter target={50} prefix="<" suffix="ms" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Global Edge Latency
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 FOUNDERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="The 4 Founders"
          title="Direct Principal Ownership on"
          gradientTitle="Every Single Project"
          subtitle="No junior developers. No outsourced agencies. You work 1-on-1 with our founding partners who have scaled systems at Stripe, AWS, and Stanford AI Lab."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundersData.map((founder, idx) => (
            <GSAPReveal key={founder.id} direction="up" delay={idx * 0.1}>
              <GlowCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-cyan-500/80 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider">
                      {founder.role.split("&")[0]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{founder.name}</h3>
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">{founder.role}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {founder.tagline}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{founder.stats[0].label}: <strong className="text-slate-900 dark:text-slate-200">{founder.stats[0].value}</strong></span>
                  <Link href="/about" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-0.5">
                    Bio <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlowCard>
            </GSAPReveal>
          ))}
        </div>
      </section>

      {/* 4. SERVICES OVERVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Capabilities"
          title="Architectural Expertise Built for"
          gradientTitle="Uncompromising Performance"
          subtitle="From zero-downtime microservices to custom LLM agent deployments, we craft software systems engineered for scale."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service, idx) => (
            <GSAPReveal key={service.id} direction="up" delay={idx * 0.1}>
              <GlowCard className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-4">{service.subtitle}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500">
                    Est. Timeline: <span className="text-slate-900 dark:text-white font-bold">{service.estimatedWeeks}</span>
                  </div>
                  <Link href="/services">
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Service Details
                    </Button>
                  </Link>
                </div>
              </GlowCard>
            </GSAPReveal>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PORTFOLIO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Case Studies"
          title="Mission-Critical Systems Built for"
          gradientTitle="Global Industry Leaders"
          subtitle="Explore selected engineering case studies highlighting performance gains, ROI metrics, and architectural innovation."
        />

        <div className="space-y-12">
          {featuredProjects.map((project, idx) => (
            <GSAPReveal key={project.id} direction="up" delay={idx * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl overflow-hidden group">
                
                {/* Image Col */}
                <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-72 sm:h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-cyan-400 border border-cyan-500/30">
                    {project.category}
                  </div>
                </div>

                {/* Content Col */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    {project.client}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Impact Grid */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
                    {project.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">{metric.value}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link href="/portfolio">
                      <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                        View Case Study
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </GSAPReveal>
          ))}
        </div>
      </section>

      {/* 6. DYNAMIC LEAD GENERATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GSAPReveal direction="up">
          <div className="relative rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-teal-950 via-[#090d16] to-cyan-950 p-10 md:p-16 overflow-hidden shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
            
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Elevate Your Platform?</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Let&apos;s Build Your Next Engineering Milestone
              </h2>
              <p className="text-slate-300 text-base">
                Book a direct architectural discovery call with Alexandre, Elena, Marcus, and Sophia. Zero sales fluff, 100% technical clarity.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => (window.location.href = "/contact")}
              >
                Schedule Lead Call
              </Button>
            </div>
          </div>
        </GSAPReveal>
      </section>

      <EstimatorModal isOpen={estimatorOpen} onClose={() => setEstimatorOpen(false)} />
    </div>
  );
}
