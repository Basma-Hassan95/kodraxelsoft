"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const ROW_A = [
  "WEB DEVELOPMENT",
  "AI AUTOMATION",
  "MOBILE APPS",
  "CLOUD SOLUTIONS",
  "BRANDING",
  "UI / UX DESIGN",
  "NEXT.JS",
  "WORDPRESS",
  "SAAS PLATFORMS",
];

const ROW_B = [
  "CLIENT SATISFACTION",
  "GLOBAL REACH",
  "CONTENT STRATEGY",
  "APP PERFORMANCE",
  "E-COMMERCE",
  "LOGO DESIGN",
  "DEVOPS",
  "CUSTOM SOFTWARE",
  "DIGITAL GROWTH",
];

function MarqueeTrack({
  items,
  reverse,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div
        className="flex items-center gap-8 px-4"
        style={{
          width: "max-content",
          animation: reverse
            ? "marquee-rev 32s linear infinite"
            : "marquee 28s linear infinite",
        }}
      >
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-flex items-center gap-8 text-sm sm:text-base font-extrabold uppercase tracking-[0.18em] text-white shrink-0"
          >
            <span>{label}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300/90 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

export const TechMarquee: React.FC = () => {
  return (
    <section className="relative py-8 sm:py-10 overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes marquee-rev {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
          `,
        }}
      />

      {/* Soft X — brand teal theme */}
      <div className="relative mx-auto h-24 sm:h-28 md:h-32 max-w-7xl">
        <div className="absolute left-1/2 top-1/2 w-[125%] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] z-10 rounded-xl bg-[#004d4d] py-3 sm:py-3.5 shadow-xl border border-[#20b2aa]/35">
          <MarqueeTrack items={ROW_A} />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[125%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] z-20 rounded-xl bg-[#006666] py-3 sm:py-3.5 shadow-xl border border-cyan-400/30">
          <MarqueeTrack items={ROW_B} reverse />
        </div>
      </div>
    </section>
  );
};
