"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { ServicesImageCards } from "@/components/ui/ServicesImageCards";
import { ServicesZigzagSections } from "@/components/ui/ServicesZigzagSections";
import { usePublicServices } from "@/hooks/usePublicCms";
import {
  ShieldCheck,
  ArrowRight,
  MessageSquareText,
} from "lucide-react";

export default function ServicesPage() {
  const servicesData = usePublicServices();

  const techStackList = [
    {
      category: "Frontend & Motion",
      techs: ["Next.js 16", "React 19", "TypeScript", "GSAP 3", "Tailwind CSS v4", "Three.js"],
    },
    {
      category: "AI & Automation",
      techs: ["PyTorch", "Python", "LangChain", "n8n", "OpenAI / Claude API", "FastAPI"],
    },
    {
      category: "Cloud & DevOps",
      techs: ["AWS / GCP", "Kubernetes", "Docker", "Terraform", "Vercel Enterprise", "Grafana"],
    },
    {
      category: "Databases & Backend",
      techs: ["PostgreSQL", "Redis", "Supabase", "GraphQL", "Stripe", "Prisma"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      <SectionHeader
        badgeText="Capabilities & Architecture"
        title="Enterprise Engineering Services"
        gradientTitle="Tailored for Scale"
        subtitle="Hover a card to reveal details — each service uses its admin background image, with a tilt-and-lift animation unique to this page."
      />

      <ServicesImageCards services={servicesData} />

      <ServicesZigzagSections services={servicesData} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 px-6 sm:px-8 py-5 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 text-slate-200">
          <MessageSquareText className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-sm">
            Not sure which service fits?{" "}
            <span className="font-semibold text-white">Talk to a principal architect</span>{" "}
            — we&apos;ll scope it for free.
          </p>
        </div>
        <Link href="/contact">
          <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Get a Free Consultation
          </Button>
        </Link>
      </motion.div>

      <section className="pt-4">
        <SectionHeader
          badgeText="Tech Stack Matrix"
          title="Battle-Tested Technologies for"
          gradientTitle="Modern Enterprise Apps"
          subtitle="We select tools with proven long-term support, performance speed, and rich developer ecosystems."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStackList.map((stack, idx) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <GlowCard className="h-full">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  {stack.category}
                </h3>
                <ul className="space-y-2">
                  {stack.techs.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
