"use client";

import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { jobRoles, JobRole } from "@/data/jobs";
import { usePublicCareers } from "@/hooks/usePublicCms";
<<<<<<< Updated upstream
import { Briefcase, MapPin, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
=======
import {
  Briefcase,
  MapPin,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Users,
  Laptop,
  Award,
  Sparkles,
} from "lucide-react";

const ACCENT = "#226263";
const ease = [0.22, 1, 0.36, 1] as const;

const PERKS = [
  {
    icon: Laptop,
    title: "Work from Anywhere",
    body: "Enjoy flexible working hours across global time zones. We value output and quality over strict office hours.",
  },
  {
    icon: Users,
    title: "Learn from Top Architects",
    body: "Work directly alongside experienced software leads on real client projects. Upgrade your skills every single day.",
  },
  {
    icon: Award,
    title: "Competitive Pay & Benefits",
    body: "Receive top-tier compensation, company equity options, and invitations to our annual company retreats.",
  },
];
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
        badgeText="Careers"
        title="Build Powerful Digital Products with"
        gradientTitle="Kodraxelsoft"
        subtitle="Open roles for talented builders who care about clean work, clear communication, and creating software that makes a real impact."
      />

      {/* Intro band */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease }}
        className="relative rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, transparent 55%)`,
          }}
        />
        <div className="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: ACCENT }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Why join us
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Work Directly with Senior Experts—{" "}
              <span style={{ color: ACCENT }}>Zero Bureaucracy</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We keep our teams small and focused. You won&apos;t get stuck in endless
              meetings or bureaucratic red tape. Instead, you&apos;ll own your projects
              and build high-performance web, mobile, and AI solutions.
            </p>
          </div>
          <Link href="/careers/apply">
            <Button
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="text-white shadow-[0_0_28px_rgba(34,98,99,0.35)]"
            >
              General Application
            </Button>
          </Link>
        </div>
      </motion.div>
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

                  <Link
                    href={applyHref(role)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] bg-[#226263] hover:bg-[#1a4f50]"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
>>>>>>> Stashed changes
                </div>

                <Link
                  href={applyHref(role)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#004d4d] to-cyan-600 hover:from-[#006666] hover:to-cyan-500 shadow-md transition-all active:scale-[0.98]"
                >
                  Apply for this role
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

<<<<<<< Updated upstream
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
=======
      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="rounded-3xl p-8 sm:p-10 text-center space-y-4 border border-[#226263]/30"
        style={{
          background: `linear-gradient(145deg, #0c1424 0%, #0a2a28 50%, #0c1424 100%)`,
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ready to Build with Us?
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Send us your profile or portfolio. We review every application and reply within a few business days.
        </p>
        <Link href="/careers/apply" className="inline-block">
          <Button
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="text-white bg-[#226263] hover:bg-[#1a4f50]"
          >
            Start Your Application
          </Button>
        </Link>
      </motion.div>
>>>>>>> Stashed changes
    </div>
  );
}
