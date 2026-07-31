"use client";

import React from "react";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePublicTestimonials } from "@/hooks/usePublicCms";
import { Star, Quote } from "lucide-react";

/** Homepage: approved client reviews only — no submit form. */
export const HomeTestimonials: React.FC = () => {
  const testimonials = usePublicTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <SectionHeader
        badgeText="Client Proof"
        title="What Partners Say About"
        gradientTitle="Kodraxelsoft Engineering"
        subtitle="Selected client testimonials approved through our studio CMS."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.slice(0, 6).map((t, idx) => (
          <GSAPReveal key={t.id} direction="up" delay={idx * 0.08}>
            <GlowCard className="h-full p-6 flex flex-col gap-4">
              <Quote className="w-5 h-5 text-cyan-500/80" />
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                “{t.review}”
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    t.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.clientName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </div>
            </GlowCard>
          </GSAPReveal>
        ))}
      </div>
    </section>
  );
};
