"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { About3DCanvas, About3DCanvasRef } from "@/components/ui/About3DCanvas";
import { ManifestoCoverflowSlider } from "@/components/ui/ManifestoCoverflowSlider";
import { ArrowRight, Zap, Globe, Terminal, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const canvasRef = useRef<About3DCanvasRef>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s1 = section1Ref.current;
    const s2 = section2Ref.current;
    if (!s1 || !s2) return;

    // ScrollTrigger tracking progress (0 to 1) between Section 1 and Section 2
    const st = ScrollTrigger.create({
      trigger: s1,
      start: "top top",
      endTrigger: s2,
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        canvasRef.current?.updateScrollProgress(self.progress);
      },
    });

    return () => st.kill();
  }, []);

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      desc: "Started as a focused software team building high-speed digital tools for local clients.",
    },
    {
      year: "2024",
      title: "Scaling Up Services",
      desc: "Built large-scale, secure web platforms for fast-growing healthcare and finance businesses.",
    },
    {
      year: "2025",
      title: "Smart AI Automation",
      desc: "Introduced automated digital assistants that take over boring office work for enterprise teams.",
    },
    {
      year: "2026",
      title: "Global Growth",
      desc: "Expanding our fast, reliable cloud systems to support clients across North America, Europe, and Asia.",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* 1. FIXED 3D BACKGROUND CANVAS (Soft Ambient Cyber World Globe) */}
      <About3DCanvas ref={canvasRef} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-24">
        
        {/* SECTION 1: Hero / Intro Section (100vh - Open Clean Typography) */}
        <section
          ref={section1Ref}
          className="min-h-screen flex flex-col justify-center items-center text-center pt-20 relative"
        >
          <div className="max-w-4xl space-y-8">
            <SectionHeader
              badgeText="About Kodraxelsoft"
              title="A Skilled Team Building Powerful Software for"
              gradientTitle="Growing Businesses"
              subtitle="Kodraxelsoft was built to skip confusing middle managers. You work directly with expert software builders who deliver real results for your business."
            />

            <div className="pt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md text-xs font-bold text-cyan-400 border border-cyan-500/30 shadow-xl">
                <Terminal className="w-4 h-4" />
                <span>Scroll down to learn more about our team</span>
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator Arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-80 animate-bounce z-20">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-slate-400">Scroll</span>
            <ChevronDown className="w-5 h-5 text-[#004d4d] dark:text-cyan-400" />
          </div>
        </section>

        {/* SECTION 2: "Architecting the Future" Section (3D Cyber Matrix Docks to Left Column) */}
        <section
          ref={section2Ref}
          className="min-h-screen flex items-center pt-12"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Left Column: Dedicated Docking Zone for 3D Cyber Matrix */}
            <div className="lg:col-span-6 h-72 sm:h-[450px] relative flex items-center justify-center pointer-events-none">
              {/* 3D Cyber Matrix Canvas docks cleanly here */}
            </div>

            {/* Right Column: Technical Architecture Copy Card with 3D Tilt & Spotlight Glow */}
            <GlowCard className="lg:col-span-6 p-8 sm:p-10 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-[#111726]/90 backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>How We Build</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Building Fast Websites & Smart AI Systems
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We blend modern design with powerful behind-the-scenes technology. You get smooth, lightning-fast digital tools that your customers love to use.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Zap className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                  <span>100/100 Speed Score (Pages load instantly on phones and computers)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Globe className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                  <span>Always Online (Your site handles heavy traffic without slowing down)</span>
                </div>
              </div>
            </GlowCard>

          </div>
        </section>

        {/* SECTION 3: Swiper.js 3D Coverflow "Our Manifesto" Section */}
        <section className="space-y-8 pt-12">
          <SectionHeader
            badgeText="Our Promise"
            title="The Core Pillars of How We"
            gradientTitle="Build Software"
            subtitle="Why growing businesses trust Kodraxelsoft to design, build, and support their digital platforms."
          />

          <GSAPReveal direction="up">
            <ManifestoCoverflowSlider />
          </GSAPReveal>
        </section>

        {/* SECTION 4: Studio Growth Milestones */}
        <section className="space-y-12 pt-8">
          <SectionHeader
            badgeText="Milestones"
            title="Our Journey of Helping"
            gradientTitle="Businesses Succeed"
            subtitle="A look at how our company has grown alongside the clients we support."
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
            Book A Free Strategy Call
          </Button>
        </section>

      </div>
    </div>
  );
}
