"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { foundersData } from "@/data/founders";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { ShieldCheck, ArrowRight, Mail, Award, Cpu, Code2, Users, Layers } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Direct Principal Ownership",
      description: "You work exclusively with our 4 founding architects. No account managers, no junior handoffs, no lost context.",
      icon: Users
    },
    {
      title: "Sub-50ms Latency SLA",
      description: "Performance is not an afterthought; it is our primary design constraint. We guarantee sub-second load speeds globally.",
      icon: Cpu
    },
    {
      title: "Zero Technical Debt",
      description: "We enforce strict TypeScript typing, modular architecture, and automated CI/CD pipelines from line one of code.",
      icon: Code2
    },
    {
      title: "Transparent Fixed Pricing",
      description: "We work on fixed-scope deliverables with guaranteed timelines. No surprise billing or scope creep.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
      
      {/* Hero Header */}
      <GSAPReveal direction="down">
        <SectionHeader
          badgeText="Our Story & Founders"
          title="Engineered by 4 Principal Architects"
          gradientTitle="Scaling Enterprise Products"
          subtitle="Kodraxelsoft was founded to eliminate the overhead of traditional software agencies. We operate as an agile, hyper-specialized team of senior engineers delivering production-ready code."
        />
      </GSAPReveal>

      {/* 4 Founders Deep Spotlight Grid */}
      <div className="space-y-16">
        {foundersData.map((founder, idx) => (
          <GSAPReveal key={founder.id} direction="up" delay={idx * 0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl items-center">
              
              {/* Founder Image Col */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 sm:h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#090d16]/30" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 flex justify-between items-center text-white">
                  <span className="text-xs font-bold">{founder.role}</span>
                </div>
              </div>

              {/* Founder Bio Col */}
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Founder 0{idx + 1}</span>
                </div>
                
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{founder.name}</h3>
                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{founder.tagline}</p>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {founder.bio}
                </p>

                {/* Core Expertise Tags */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
                    Core Technical Domains:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.expertise.map((exp, eIdx) => (
                      <span key={eIdx} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Founder Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {founder.stats.map((stat, sIdx) => (
                    <div key={sIdx}>
                      <div className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{stat.value}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 pt-1">
                    {founder.socials.github && (
                      <a href={founder.socials.github} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {founder.socials.linkedin && (
                      <a href={founder.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}
                    <a href={`mailto:${founder.socials.email}`} className="hover:text-cyan-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </GSAPReveal>
        ))}
      </div>

      {/* Core Values & Philosophy */}
      <section className="pt-12">
        <SectionHeader
          badgeText="Our Philosophy"
          title="The Kodraxelsoft Engineering Manifesto"
          subtitle="Why enterprise clients trust our 4-person team to build their most ambitious products."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
                <GlowCard className="p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{val.description}</p>
                </GlowCard>
              </GSAPReveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-8">
        <Button
          variant="teal-gradient"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          onClick={() => (window.location.href = "/contact")}
        >
          Book Founder Consultation
        </Button>
      </section>

    </div>
  );
}
