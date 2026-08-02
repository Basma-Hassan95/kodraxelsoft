"use client";

import React from "react";
import Link from "next/link";
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
  ArrowRight,
  CheckCircle2,
  Clock,
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
};

export const CapabilitiesShowcase: React.FC = () => {
  const services = usePublicServices();

  if (!services.length) return null;

  return (
    <div className="w-full space-y-10">
      <GSAPReveal
        stagger={0.07}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
      >
        {services.map((service: Service, index: number) => {
          const Icon = ICON_MAP[service.iconName] || Code;
          const slug = service.slug || service.id;

          return (
            <GlowCard
              key={service.id}
              className="h-full flex flex-col p-6 sm:p-7 group"
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                {service.title}
              </h3>
              <p className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 mt-1.5 mb-3">
                {service.subtitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                {service.description}
              </p>

              <ul className="mt-5 space-y-2">
                {service.features.slice(0, 3).map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.estimatedWeeks}</span>
                </div>
                <Link href={`/services/${slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Details
                  </Button>
                </Link>
              </div>
            </GlowCard>
          );
        })}
      </GSAPReveal>

      <GSAPReveal direction="up" className="flex justify-center">
        <Link href="/services">
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View All Services
          </Button>
        </Link>
      </GSAPReveal>
    </div>
  );
};
