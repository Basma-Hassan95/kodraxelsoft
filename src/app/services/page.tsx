"use client";

import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicServices } from "@/hooks/usePublicCms";
import type { Service } from "@/data/services";
import {
  Code,
  Cpu,
  Layers,
  Zap,
  Bot,
  Globe,
  Package,
  ShieldCheck,
  ArrowRight,
  MessageSquareText,
  Clock,
  Tag
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Cpu,
  Layers,
  Zap,
  Bot,
  Globe,
  Package
};

function ServiceIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = ICON_MAP[iconName] || Code;
  return <Icon className={className} />;
}

export default function ServicesPage() {
  const servicesData = usePublicServices();

  const techStackList = [
<<<<<<< Updated upstream
    { category: "Frontend & Motion", techs: ["Next.js 16", "React 19", "TypeScript", "GSAP 3", "Tailwind CSS v4", "Three.js"] },
    { category: "AI & Automation", techs: ["PyTorch", "Python", "LangChain", "n8n", "OpenAI / Claude API", "FastAPI"] },
    { category: "Cloud & DevOps", techs: ["AWS / GCP", "Kubernetes", "Docker", "Terraform", "Vercel Enterprise", "Grafana"] },
    { category: "Databases & Backend", techs: ["PostgreSQL", "Redis", "Supabase", "GraphQL", "Stripe", "Prisma"] }
=======
    {
      category: "Modern Design & Speed",
      techs: [
        "Modern Web Frameworks",
        "Instant Page Loaders",
        "Fast Mobile Interfaces",
        "Interactive Animations",
      ],
    },
    {
      category: "Smart AI & Automation",
      techs: [
        "Python AI Models",
        "Smart Search Engines",
        "Automated App Links",
        "Voice & Chat Helpers",
      ],
    },
    {
      category: "Safe Cloud & Servers",
      techs: [
        "Amazon & Google Cloud",
        "Automated Backups",
        "High-Traffic Scaling",
        "24/7 System Health",
      ],
    },
    {
      category: "Reliable Databases",
      techs: [
        "Protected Databases",
        "Fast Data Retrieval",
        "Encrypted Storage",
        "Secure Payment",
      ],
    },
>>>>>>> Stashed changes
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">

      {/* Header */}
      <SectionHeader
<<<<<<< Updated upstream
        badgeText="Capabilities & Architecture"
        title="Enterprise Engineering Services"
        gradientTitle="Tailored for Scale"
        subtitle="Direct technical execution with zero layers of management. Partner directly with our principal architects to architect high-performance platforms."
=======
        badgeText="CAPABILITIES & ARCHITECTURE"
        title="Custom Software & Digital Services Built for"
        gradientTitle="Growth"
        subtitle="We build modern websites, mobile apps, and smart AI tools for growing companies. Hover over any service to see how we help your business succeed."
>>>>>>> Stashed changes
      />

      {/* Service Card Grid */}
      <GSAPReveal
        stagger={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
<<<<<<< Updated upstream
        {servicesData.map((service: Service) => {
          const slug = service.slug || service.id;
          return (
            <GlowCard key={service.id} className="h-full flex flex-col p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <ServiceIcon iconName={service.iconName} className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {service.estimatedWeeks}
                </span>
              </div>
=======
        <div className="flex items-center gap-3 text-slate-200">
          <MessageSquareText className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-sm">
            Not sure which service fits your business? Speak directly with an
            expert—we will plan your project scope for free.
          </p>
        </div>
        <Link href="/contact">
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Get a Free Consultation →
          </Button>
        </Link>
      </motion.div>
>>>>>>> Stashed changes

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                {service.title}
              </h3>
              <p className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 mt-1 mb-3">
                {service.subtitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {service.technologies.slice(0, 4).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-[#004d4d] dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
                {service.technologies.length > 4 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-500 dark:text-slate-500">
                    +{service.technologies.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Starting at</span>
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {service.basePrice}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Link href={`/services/${slug}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                  >
                    View Details
                  </Button>
                </Link>
                <Link
                  href={`/contact?service=${encodeURIComponent(slug)}&serviceName=${encodeURIComponent(service.title)}`}
                  className="flex-1"
                >
                  <Button
                    variant="teal-gradient"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="w-full justify-center"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </GlowCard>
          );
        })}
      </GSAPReveal>

      {/* Trust strip */}
      <GSAPReveal direction="up">
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 px-6 sm:px-8 py-5 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-200">
            <MessageSquareText className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-sm">
              Not sure which service fits? <span className="font-semibold text-white">Talk to a principal architect</span> — we&apos;ll scope it for free.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Get a Free Consultation
            </Button>
          </Link>
        </div>
      </GSAPReveal>

      {/* Technology Stack Matrix */}
      <section className="pt-4">
        <SectionHeader
          badgeText="RELIABLE INFRASTRUCTURE"
          title="Modern, Battle-Tested Technologies for"
          gradientTitle="Your Apps"
          subtitle="We use fast, dependable tools with proven long-term reliability so your business software stays quick, secure, and future-proof."
        />

        <GSAPReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStackList.map((stack, idx) => (
<<<<<<< Updated upstream
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
=======
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: idx * 0.08,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
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
>>>>>>> Stashed changes
          ))}
        </GSAPReveal>
      </section>

    </div>
  );
}
