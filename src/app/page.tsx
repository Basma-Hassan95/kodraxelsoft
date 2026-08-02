"use client";

import React from "react";
import Link from "next/link";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Hero3DCanvas } from "@/components/ui/Hero3DCanvas";
import { CapabilitiesShowcase } from "@/components/ui/CapabilitiesShowcase";
import { CaseStudiesStackedCarousel } from "@/components/ui/CaseStudiesStackedCarousel";
import { LiveProjectsShowcase } from "@/components/ui/LiveProjectsShowcase";
import { SocialCampaignsShowcase } from "@/components/ui/SocialCampaignsShowcase";
import { HomeTestimonials } from "@/components/ui/HomeTestimonials";
import { usePublicProjects } from "@/hooks/usePublicCms";
import { projectsData as fallbackProjects } from "@/data/projects";
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Award,
  Globe
} from "lucide-react";

export default function HomePage() {
  const projectsData = usePublicProjects();
  // Case Studies: admin "Case Studies" flag; fallback to demo featured so stacked animation stays visible
  const featuredFromCms = projectsData.filter((p) => p.featured);
  const homeCaseStudies =
    featuredFromCms.length > 0
      ? featuredFromCms
      : fallbackProjects.filter((p) => p.featured);
  // Live Projects: admin "Live Projects"; else live URL and not case-study
  const liveMarked = projectsData.filter((p) => p.liveProject);
  const homeLiveProjects =
    liveMarked.length > 0
      ? liveMarked
      : projectsData.filter((p) => Boolean(p.demoUrl) && !p.featured);

  return (
    <div className="space-y-24 md:space-y-36 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH REAL 3D WEBGL INTERACTIVE CANVAS */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
        
        {/* Three.js Dynamic WebGL Wireframe Canvas */}
        <Hero3DCanvas />

        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#004d4d]/20 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute top-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <GSAPReveal direction="down">
            <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full border border-[#006666]/40 bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-300 text-xs font-medium uppercase tracking-wider mb-8 shadow-sm">
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
              Kodraxelsoft is an ultra-premium software engineering laboratory. We partner with enterprise visionaries to architect sub-50ms Next.js web platforms, custom AI models, and cloud infrastructure.
            </p>
          </GSAPReveal>

          {/* Hero Action Buttons */}
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
                icon={<Code2 className="w-5 h-5" />}
                onClick={() => (window.location.href = "/services")}
              >
                Explore Capabilities
              </Button>
            </div>
          </GSAPReveal>

          {/* Hero Code / Interactive Architecture Console */}
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
                  <div className="text-cyan-400 font-bold">// 2. 3D WebGL Engine</div>
                  <div className="text-slate-400">gsap.to(&quot;.hero-3d-node&quot;, &#123;</div>
                  <div className="pl-4 text-sky-400">rotationY: 360, duration: 1.2,</div>
                  <div className="pl-4 text-amber-300">ease: &quot;power3.out&quot;</div>
                  <div className="text-slate-400">&#125;);</div>
                </div>
                <div className="space-y-2">
                  <div className="text-cyan-400 font-bold">// 3. Autonomous AI Cluster</div>
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
        <GSAPReveal direction="up" duration={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#004d4d] dark:text-cyan-400">
                <AnimatedCounter target={99.8} decimals={1} suffix="%" />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Threat Detection SLA
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#004d4d] dark:text-cyan-400">
                &lt;<AnimatedCounter target={10} suffix="ms" />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Neural Inference Latency
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#004d4d] dark:text-cyan-400">
                $<AnimatedCounter target={1.4} decimals={1} suffix="B+" />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Daily Transaction Volume
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#004d4d] dark:text-cyan-400">
                <AnimatedCounter target={100} suffix="/100" />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Lighthouse Performance
              </div>
            </div>
          </div>
        </GSAPReveal>
      </section>

      {/* 3. CAPABILITIES / SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Capabilities"
          title="Architectural Expertise Built for"
          gradientTitle="Uncompromising Performance"
          subtitle="From zero-downtime microservices to custom LLM agent deployments, we craft software systems engineered for scale."
        />

        <CapabilitiesShowcase />
      </section>

      {/* 4. CASE STUDIES — stacked card animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Case Studies"
          title="Mission-Critical Systems Built for"
          gradientTitle="Global Industry Leaders"
          subtitle="Explore selected engineering case studies — image or video, impact metrics, and full project breakdowns."
        />

        <CaseStudiesStackedCarousel projects={homeCaseStudies} />
      </section>

      {/* 5. LIVE PROJECTS — cinematic cards, click opens live host */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Live Projects"
          title="Products We Shipped to"
          gradientTitle="Production"
          subtitle="Real builds with image or video previews. Click any project to open its live hosted website."
        />

        <LiveProjectsShowcase projects={homeLiveProjects} />
      </section>

      {/* 6. SOCIAL MEDIA CAMPAIGNS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SocialCampaignsShowcase />
      </section>

      {/* 6b. CLIENT REVIEWS */}
      <HomeTestimonials />

      {/* 7. DYNAMIC LEAD GENERATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GSAPReveal direction="up">
          <div className="relative rounded-3xl border border-[#006666]/40 bg-[#0c1424] dark:bg-[#111726] p-10 md:p-16 overflow-hidden shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-[#004d4d]/20 rounded-full blur-3xl" />
            
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004d4d]/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Elevate Your Platform?</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Let&apos;s Build Your Next Engineering Milestone
              </h2>
              <p className="text-slate-300 text-base">
                Schedule a direct technical discovery consultation with our principal architects. Zero sales fluff, 100% engineering clarity.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => (window.location.href = "/contact")}
              >
                Schedule Discovery Call
              </Button>
            </div>
          </div>
        </GSAPReveal>
      </section>

    </div>
  );
}
