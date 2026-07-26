"use client";

import React from "react";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export const LinkedInBrandIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z" />
  </svg>
);

export const InstagramBrandIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const MetaBrandIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export interface CampaignAd {
  id: string;
  channel: "LinkedIn" | "Instagram" | "Meta / Facebook";
  icon: React.FC<{ className?: string }>;
  tagColor: string;
  badge: string;
  title: string;
  copy: string;
  stats: { label: string; value: string }[];
  ctaText: string;
  linkUrl: string;
}

export const campaignsData: CampaignAd[] = [
  {
    id: "campaign-1",
    channel: "LinkedIn",
    icon: LinkedInBrandIcon,
    tagColor: "bg-blue-600/20 text-blue-500 border-blue-500/30",
    badge: "LinkedIn Sponsored Executive Brief",
    title: "Sub-50ms Next.js 16 Edge Architectures for Enterprise Leaders",
    copy: "Eliminate render bottlenecks with React Server Components & Turbopack. Partner directly with our senior principal architects.",
    stats: [
      { label: "Impressions", value: "340K" },
      { label: "CTR Avg", value: "5.2%" },
      { label: "Client Match", value: "99.4%" }
    ],
    ctaText: "View Campaign Brief",
    linkUrl: "/services"
  },
  {
    id: "campaign-2",
    channel: "Instagram",
    icon: InstagramBrandIcon,
    tagColor: "bg-pink-600/20 text-pink-500 border-pink-500/30",
    badge: "Instagram Creative Reel Highlight",
    title: "60 FPS GSAP Motion Engineering & UI Micro-Physics",
    copy: "Transform static browser layouts into fluid interactive experiences. Watch our latest WebGL & GSAP animation design breakdown.",
    stats: [
      { label: "Video Views", value: "180K" },
      { label: "Engagement", value: "98.2%" },
      { label: "Likes & Shares", value: "14.2K" }
    ],
    ctaText: "Watch Ad Breakdown",
    linkUrl: "/portfolio"
  },
  {
    id: "campaign-3",
    channel: "Meta / Facebook",
    icon: MetaBrandIcon,
    tagColor: "bg-sky-600/20 text-sky-400 border-sky-500/30",
    badge: "Meta Enterprise Sponsored Ad",
    title: "Autonomous AI Multi-Agent Orchestrations for Scale",
    copy: "Empower your business with domain-specific vector memory, custom PyTorch LLM pipelines, and automated zero-hallucination agents.",
    stats: [
      { label: "Reach", value: "520K" },
      { label: "ROI Multiple", value: "4.8x" },
      { label: "Target CTOs", value: "Fortune 500" }
    ],
    ctaText: "Explore AI Case Study",
    linkUrl: "/about"
  }
];

export const SocialCampaignsShowcase: React.FC = () => {
  return (
    <section className="space-y-10">
      <SectionHeader
        badgeText="Marketing & Media Highlights"
        title="Active Social Media"
        gradientTitle="Campaigns & Ad Showcases"
        subtitle="Live marketing ad highlights running across Meta, Instagram, and LinkedIn demonstrating Kodraxelsoft's architectural capabilities."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {campaignsData.map((ad, idx) => {
          const Icon = ad.icon;
          return (
            <GSAPReveal key={ad.id} direction="up" delay={idx * 0.1}>
              <GlowCard className="h-full flex flex-col justify-between p-6 group">
                <div>
                  {/* Mock Ad Header */}
                  <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${ad.tagColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>Kodraxelsoft</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {ad.channel} • Sponsored Campaign
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      Live Ad
                    </span>
                  </div>

                  {/* Mock Ad Visual Solid Matte Canvas */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-5 border border-slate-300 dark:border-slate-800 bg-[#0f172a] dark:bg-[#0a0f1d] p-4 flex flex-col justify-between text-white group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-900/90 border border-slate-700">
                        {ad.badge}
                      </span>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    
                    <div>
                      <div className="text-xs font-extrabold tracking-tight text-white drop-shadow-md line-clamp-2">
                        {ad.title}
                      </div>
                      <div className="text-[10px] text-cyan-400 mt-1 font-mono">
                        SLA: &lt;50ms • Next.js 16 • PyTorch
                      </div>
                    </div>
                  </div>

                  {/* Ad Body Copy */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {ad.copy}
                  </p>

                  {/* Ad Performance Metrics Chips */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 mb-4 text-center">
                    {ad.stats.map((stat, sIdx) => (
                      <div key={sIdx}>
                        <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">{stat.value}</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium truncate">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ad CTA Link */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    variant="teal-gradient"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => (window.location.href = ad.linkUrl)}
                    className="w-full justify-center text-xs"
                  >
                    {ad.ctaText}
                  </Button>
                </div>
              </GlowCard>
            </GSAPReveal>
          );
        })}
      </div>
    </section>
  );
};
