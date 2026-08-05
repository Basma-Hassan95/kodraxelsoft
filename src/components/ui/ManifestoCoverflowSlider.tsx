"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { Users, Cpu, Code2, ShieldCheck, LucideIcon } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export interface ManifestoPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  stat: string;
}

const manifestoPillars: ManifestoPillar[] = [
  {
    id: "clean-code",
    title: "Built Clean Right from the Start",
    subtitle: "Clean Code",
    description:
      "We write clear, high-quality code from day one. This means your software stays bug-free, runs smoothly, and won't need expensive rebuilds later.",
    icon: Code2,
    stat: "100% Reliable Build",
  },
  {
    id: "sla-guarantee",
    title: "Clear Guarantees & Guaranteed Results",
    subtitle: "Fixed Timelines",
    description:
      "You get a fixed launch date and price with no surprise costs. Plus, we include a 30-day post-launch warranty to guarantee everything works perfectly.",
    icon: ShieldCheck,
    stat: "100% Speed & Quality Guarantee",
  },
  {
    id: "principal-engineering",
    title: "Work Directly with the Experts",
    subtitle: "Zero Handoffs",
    description:
      "You partner straight with our senior software architects. No confusing account managers, no junior developers, and zero lost details.",
    icon: Users,
    stat: "Direct Senior Expert Access",
  },
  {
    id: "edge-performance",
    title: "Instant Speed Across the Globe",
    subtitle: "Zero Bottlenecks",
    description:
      "Your site or app opens in a fraction of a second, anywhere in the world. Fast loading keeps your customers happy and increases overall sales.",
    icon: Cpu,
    stat: "Instant Global Loading",
  },
];

export const ManifestoCoverflowSlider: React.FC = () => {
  return (
    <div className="w-full py-6 relative select-none">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full !pb-14"
      >
        {manifestoPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <SwiperSlide
              key={pillar.id}
              className="!w-[85vw] sm:!w-[420px] max-w-[420px] transition-all duration-300"
            >
              <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-8 shadow-2xl space-y-6 h-full flex flex-col justify-between group hover:border-[#004d4d] dark:hover:border-cyan-500/50 transition-colors duration-300">
                
                <div className="space-y-4">
                  {/* Top Icon Badge & Subtitle */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#004d4d]/10 border border-[#006666]/30 flex items-center justify-center text-[#004d4d] dark:text-cyan-400">
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Highlighted Stat Badge at Bottom */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs font-extrabold text-[#004d4d] dark:text-cyan-400 tracking-wide">
                      {pillar.stat}
                    </span>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
