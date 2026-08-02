"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicServices } from "@/hooks/usePublicCms";
import {
  Code,
  Cpu,
  Layers,
  Zap,
  Bot,
  Globe,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Tag,
  Sparkles,
  Layers3
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

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const services = usePublicServices();

  const service = services.find((s) => (s.slug || s.id) === slug || s.id === slug);

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Layers3 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Service Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We couldn&apos;t find a service matching &quot;{slug}&quot;. It may have been renamed or removed. Browse our full capabilities below.
        </p>
        <Link href="/services">
          <Button variant="teal-gradient" size="md" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
            Back to All Services
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = ICON_MAP[service.iconName] || Code;
  const resolvedSlug = service.slug || service.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">

      {/* Back link */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Services</span>
      </Link>

      {/* Hero */}
      <GSAPReveal direction="up">
        <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider border border-cyan-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Service Capability</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {service.title}
              </h1>
              <p className="text-base font-semibold text-[#004d4d] dark:text-cyan-400 mt-2">
                {service.subtitle}
              </p>
            </div>
          </div>
        </div>
      </GSAPReveal>

      {/* Main grid: description/features/deliverables + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-7 space-y-10">
          <GSAPReveal direction="up">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Overview</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          </GSAPReveal>

          <GSAPReveal direction="up">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </GSAPReveal>

          <GSAPReveal direction="up">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Deliverables</h2>
              <ul className="space-y-2.5">
                {service.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GSAPReveal>

          <GSAPReveal direction="up">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#004d4d] dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </GSAPReveal>
        </div>

        {/* Sidebar */}
        <GSAPReveal direction="right" className="lg:col-span-5 lg:sticky lg:top-24">
          <GlowCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Tag className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                <span>Pricing</span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {service.basePrice}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                <span>Timeline</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold">
                {service.estimatedWeeks}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fixed-scope engagement backed by NDA protection and a 30-day post-launch warranty. Final quote confirmed after a free technical discovery call.
            </p>

            <Link
              href={`/contact?service=${encodeURIComponent(resolvedSlug)}&serviceName=${encodeURIComponent(service.title)}`}
            >
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Contact Us About This Service
              </Button>
            </Link>
          </GlowCard>
        </GSAPReveal>
      </div>

      {/* CTA banner */}
      <GSAPReveal direction="up">
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 px-6 sm:px-8 py-6 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to start your {service.title.split("&")[0].trim()} project?</h3>
            <p className="text-sm text-slate-300 mt-1">Get a free scoping call with our principal architects within 24 hours.</p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(resolvedSlug)}&serviceName=${encodeURIComponent(service.title)}`}
          >
            <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Contact Us
            </Button>
          </Link>
        </div>
      </GSAPReveal>

    </div>
  );
}
