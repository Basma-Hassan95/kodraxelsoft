"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { usePublicServices } from "@/hooks/usePublicCms";
import {
  serviceBackgroundImage,
  serviceSecondaryImage,
  serviceDetailImage,
} from "@/lib/serviceImages";
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
  Tag,
  Sparkles,
  Layers3,
  Target,
  Monitor,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Cpu,
  Layers,
  Zap,
  Bot,
  Globe,
  Package,
  Sparkles,
  ShieldCheck,
};

const SIDEBAR_ICONS = [Target, Monitor, ShieldCheck, Megaphone];

const ease = [0.22, 1, 0.36, 1] as const;

function DetailBullet({ text }: { text: string }) {
  const colon = text.indexOf(": ");
  const hasLabel = colon > 0 && colon < 60;
  const label = hasLabel ? text.slice(0, colon) : null;
  const body = hasLabel ? text.slice(colon + 2) : text;

  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
      <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
      <span>
        {label ? (
          <>
            <span className="font-bold text-slate-900 dark:text-white">
              {label}:
            </span>{" "}
            {body}
          </>
        ) : (
          body
        )}
      </span>
    </li>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const services = usePublicServices();
  const parallaxRef = useRef<HTMLDivElement>(null);

  const service = services.find(
    (s) => (s.slug || s.id) === slug || s.id === slug
  );

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

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
          We couldn&apos;t find a service matching &quot;{slug}&quot;. Browse our full capabilities below.
        </p>
        <Link href="/services">
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Back to All Services
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = ICON_MAP[service.iconName] || Code;
  const resolvedSlug = service.slug || service.id;
  const heroImage = serviceBackgroundImage(service);
  const secondaryImage = serviceSecondaryImage(service);
  const detailImage = serviceDetailImage(service);
  const otherServices = services
    .filter((s) => s.id !== service.id)
    .slice(0, 4);

  return (
    <div className="pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Services
        </Link>
      </div>

      {/* Service Overview — Contour-style + parallax image */}
      <section
        ref={parallaxRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: sticky image + overview intro */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  Service{" "}
                </span>
                <span className="text-[#004d4d] dark:text-cyan-400">Overview</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {service.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-[#006666]/20">
                  <Icon className="w-3.5 h-3.5" />
                  {service.subtitle}
                </span>
                {service.detailMiddleBadge ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-[#006666]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {service.detailMiddleBadge}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-[#006666]/20">
                  <Tag className="w-3.5 h-3.5" />
                  {service.detailScopeBadge || "Fixed Scope Project"}
                </span>
              </div>
            </motion.div>

            {/* Sticky / parallax image — stays while content below scrolls */}
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[16/10] rounded-[1.75rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                <motion.img
                  src={heroImage}
                  alt={service.title}
                  style={{ y: imageY, scale: imageScale }}
                  className="absolute inset-0 w-full h-[125%] object-cover -top-[10%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041628]/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                    {service.title}
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: We Deliver Excellence list */}
          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                We Deliver{" "}
              </span>
              <span className="text-[#004d4d] dark:text-cyan-400">Excellence</span>
            </h2>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
              {(otherServices.length > 0
                ? otherServices.map((s) => ({
                    key: s.id,
                    label: s.title,
                    href: `/services/${s.slug || s.id}`,
                  }))
                : service.features.slice(0, 4).map((f, i) => ({
                    key: `feat-${i}`,
                    label: f,
                    href: `/services/${resolvedSlug}`,
                  }))
              ).map((item, i) => {
                const ItemIcon = SIDEBAR_ICONS[i % SIDEBAR_ICONS.length];
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 py-5 group"
                    >
                      <span className="w-11 h-11 rounded-full bg-white dark:bg-[#111726] shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#004d4d] dark:text-cyan-400 group-hover:bg-[#004d4d] group-hover:text-white dark:group-hover:bg-cyan-500 dark:group-hover:text-slate-950 transition-colors">
                        <ItemIcon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-bold text-[#0a2a4a] dark:text-slate-100 group-hover:text-[#004d4d] dark:group-hover:text-cyan-400 transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href={`/contact?service=${encodeURIComponent(resolvedSlug)}&serviceName=${encodeURIComponent(service.title)}`}
              className="mt-8 block"
            >
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Contact About This Service →
              </Button>
            </Link>
          </motion.aside>
        </div>
      </section>

      {/* Scroll content while image above can feel sticky — deep detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Zigzag block 1: text left */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease }}
            className="space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {service.detailProblemTitle || service.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {service.detailProblemIntro || service.description}
            </p>
            <ul className="space-y-2.5 pt-2">
              {service.features.map((feat) => (
                <DetailBullet key={feat} text={feat} />
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
            className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondaryImage}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#004d4d]/25 mix-blend-multiply" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
            className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-slate-200 dark:border-slate-800 lg:order-1 order-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detailImage}
              alt={`${service.title} — solution visual`}
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#041628]/60 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease }}
            className="space-y-4 lg:order-2 order-1"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {service.detailSolutionTitle ||
                "We Build Solutions That Actually Work"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {service.detailSolutionIntro ||
                "A simple, human-first delivery approach—clear scope, senior expert execution, and zero technical hassle from day one."}
            </p>
            <ul className="space-y-2.5 pt-2">
              {service.deliverables.map((del) => (
                <li
                  key={del}
                  className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                >
                  <ShieldCheck className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    {(() => {
                      const colon = del.indexOf(": ");
                      const hasLabel = colon > 0 && colon < 70;
                      if (!hasLabel) return del;
                      return (
                        <>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {del.slice(0, colon)}:
                          </span>{" "}
                          {del.slice(colon + 2)}
                        </>
                      );
                    })()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-3">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-semibold border border-[#006666]/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#006666]/40 bg-[#0c1424] px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-lg font-bold text-white">
              {service.ctaTitle ||
                `Ready to start your ${service.title.split("&")[0].trim()} project?`}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {service.ctaBody ||
                "Book a free discovery call with our senior architects to map out your plan within 24 hours."}
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(resolvedSlug)}&serviceName=${encodeURIComponent(service.title)}`}
          >
            <Button variant="teal-gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Contact Us →
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
