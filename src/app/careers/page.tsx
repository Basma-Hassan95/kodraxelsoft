"use client";

import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { jobRoles, JobRole } from "@/data/jobs";
import { usePublicCareers } from "@/hooks/usePublicCms";
import { Briefcase, MapPin, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CareersPage() {
  const cmsCareers = usePublicCareers();
  const roles: JobRole[] =
    cmsCareers.length > 0
      ? cmsCareers.map((c) => ({
          id: c.id,
          title: c.title,
          department: c.department || "Engineering",
          location: c.location,
          type: c.type,
          salaryRange: c.salary,
          experience: c.type,
          description: c.description,
          responsibilities: c.requirements,
          requirements: c.requirements,
          perks: [],
        }))
      : jobRoles;

  const applyHref = (role: JobRole) =>
    `/careers/apply?career=${encodeURIComponent(role.id)}&title=${encodeURIComponent(role.title)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      <SectionHeader
        badgeText="Join Kodraxelsoft"
        title="Build the Next Generation of"
        gradientTitle="High-Scale Software"
        subtitle="Work directly alongside senior principal architects. We are scaling our engineering team with passionate senior engineers, AI researchers, and creative technologists."
      />

      <GSAPReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">100% Remote Flexibility</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Work from anywhere with a $3,000 home office budget and flexible hours across US & European time zones.
          </p>
        </GlowCard>
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Architect Mentorship</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Direct 1-on-1 pairing with senior principal engineers on high-impact enterprise client systems.
          </p>
        </GlowCard>
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Competitive Equity & Perks</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Competitive top-tier base salaries, early team equity, full health benefits, and annual engineering retreats.
          </p>
        </GlowCard>
      </GSAPReveal>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Current Open Positions ({roles.length})
          </h2>
          <Link
            href="/careers/apply"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500/40 transition-colors"
          >
            General application
          </Link>
        </div>

        <GSAPReveal stagger={0.1} className="space-y-6">
          {roles.map((role) => (
            <GlowCard key={role.id} className="p-8 space-y-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="px-2.5 py-1 rounded bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                    {role.type}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{role.department}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.salaryRange}
                    </span>
                  </div>
                </div>

                <Link
                  href={applyHref(role)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#004d4d] to-cyan-600 hover:from-[#006666] hover:to-cyan-500 shadow-md transition-all active:scale-[0.98]"
                >
                  Apply for this role
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {role.description}
              </p>

              {role.requirements?.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-3">
                    Requirements
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {role.requirements.map((req) => (
                      <li
                        key={req}
                        className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </GlowCard>
          ))}
        </GSAPReveal>
      </div>
    </div>
  );
}
