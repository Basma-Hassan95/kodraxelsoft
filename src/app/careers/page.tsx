"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { jobRoles, JobRole } from "@/data/jobs";
import { usePublicCareers } from "@/hooks/usePublicCms";
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
    title: "Remote-first",
    body: "Work from anywhere with flexible hours across global time zones.",
  },
  {
    icon: Users,
    title: "Principal mentorship",
    body: "Pair directly with senior architects on real client systems.",
  },
  {
    icon: Award,
    title: "Equity & benefits",
    body: "Competitive pay, early equity, and annual engineering retreats.",
  },
];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-30"
        style={{ backgroundColor: ACCENT }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-[110px] opacity-20"
        style={{ backgroundColor: ACCENT }}
      />

      <SectionHeader
        badgeText="Careers"
        title="Build With"
        gradientTitle="Kodraxelsoft"
        subtitle="Open roles for engineers who care about craft, clarity, and shipping products that last."
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
              Ship with principal engineers —{" "}
              <span style={{ color: ACCENT }}>no fluff layers</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Small team, high ownership, production-grade work across web, mobile,
              AI, and cloud.
            </p>
          </div>
          <Link href="/careers/apply">
            <Button
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="text-white shadow-[0_0_28px_rgba(34,98,99,0.35)]"
            >
              General application
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PERKS.map((perk, i) => {
          const Icon = perk.icon;
          return (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] p-6 overflow-hidden"
            >
              <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: ACCENT }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                  backgroundColor: "rgba(34,98,99,0.12)",
                  borderColor: "rgba(34,98,99,0.3)",
                  color: ACCENT,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div
                className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2"
                style={{ color: ACCENT }}
              >
                0{i + 1}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {perk.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {perk.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Open roles */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1"
              style={{ color: ACCENT }}
            >
              Openings
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Open roles{" "}
              <span style={{ color: ACCENT }}>({roles.length})</span>
            </h2>
          </div>
          <Link
            href="/careers/apply"
            className="text-xs font-bold hover:underline"
            style={{ color: ACCENT }}
          >
            Can&apos;t find a fit? Apply generally →
          </Link>
        </motion.div>

        <div className="space-y-5">
          {roles.map((role, idx) => (
            <motion.article
              key={role.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -36 : 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.04, ease }}
              whileHover={{ y: -3 }}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#226263]/40 transition-shadow duration-300"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                style={{ backgroundColor: ACCENT }}
              />

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: "rgba(34,98,99,0.1)",
                          borderColor: "rgba(34,98,99,0.3)",
                          color: ACCENT,
                        }}
                      >
                        {role.type}
                      </span>
                      {role.department && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {role.department}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 transition-colors group-hover:text-[#226263]">
                      {role.title || role.department}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        {role.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        {role.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        {role.salaryRange}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={applyHref(role)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] bg-[#226263] hover:bg-[#1a4f50]"
                  >
                    Apply now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {role.description}
                </p>

                {role.requirements?.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4
                      className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
                      style={{ color: ACCENT }}
                    >
                      Requirements
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {role.requirements.map((req, rIdx) => (
                        <motion.li
                          key={req}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: rIdx * 0.03, duration: 0.3 }}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: ACCENT }}
                          />
                          {req}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

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
          Ready to build with us?
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Send your profile — we reply within a few business days.
        </p>
        <Link href="/careers/apply" className="inline-block">
          <Button
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="text-white bg-[#226263] hover:bg-[#1a4f50]"
          >
            Start your application
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
