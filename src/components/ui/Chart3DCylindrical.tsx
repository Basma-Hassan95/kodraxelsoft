"use client";

import React, { useState } from "react";

export interface Chart3DDataItem {
  label: string;
  value: number; // Percentage 0 - 100
  actualVal: string;
  colorName: string;
  bgGradient: string;
  topCapColor: string;
}

interface Chart3DCylindricalProps {
  data?: Chart3DDataItem[];
}

const defaultChartData: Chart3DDataItem[] = [
  {
    label: "Mon",
    value: 45,
    actualVal: "14,200",
    colorName: "Coral Red",
    bgGradient: "from-rose-500 via-rose-600 to-rose-700",
    topCapColor: "#f87171"
  },
  {
    label: "Tue",
    value: 68,
    actualVal: "18,450",
    colorName: "Amber Gold",
    bgGradient: "from-amber-400 via-amber-500 to-amber-600",
    topCapColor: "#fbbf24"
  },
  {
    label: "Wed",
    value: 98,
    actualVal: "24,580",
    colorName: "Emerald Green",
    bgGradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    topCapColor: "#34d399"
  },
  {
    label: "Thu",
    value: 55,
    actualVal: "16,100",
    colorName: "Cyan Blue",
    bgGradient: "from-sky-400 via-sky-500 to-sky-600",
    topCapColor: "#38bdf8"
  },
  {
    label: "Fri",
    value: 85,
    actualVal: "21,900",
    colorName: "Purple Violet",
    bgGradient: "from-purple-500 via-purple-600 to-purple-700",
    topCapColor: "#c084fc"
  },
  {
    label: "Sat",
    value: 40,
    actualVal: "12,800",
    colorName: "Teal Cyan",
    bgGradient: "from-teal-400 via-teal-500 to-teal-600",
    topCapColor: "#2dd4bf"
  },
  {
    label: "Sun",
    value: 60,
    actualVal: "17,300",
    colorName: "Indigo Glow",
    bgGradient: "from-indigo-500 via-indigo-600 to-indigo-700",
    topCapColor: "#818cf8"
  }
];

export const Chart3DCylindrical: React.FC<Chart3DCylindricalProps> = ({
  data = defaultChartData,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hasTraffic = data.some((d) => Number(d.actualVal) > 0);

  return (
    <div className="w-full space-y-4 select-none">
      {!hasTraffic && (
        <p className="text-[11px] text-slate-500 text-center">
          No visitor traffic recorded yet for this week — numbers will grow as
          people browse the public site (VisitTracker).
        </p>
      )}

      {/* 3D Cylinder Chart Container */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-900/60 dark:bg-[#090d16]/80 rounded-2xl border border-slate-300/60 dark:border-slate-800 p-6 flex items-end justify-between gap-2 sm:gap-6 shadow-inner overflow-hidden">
        
        {/* Subtle Background Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
          <div className="border-b border-slate-400 border-dashed w-full" />
          <div className="border-b border-slate-400 border-dashed w-full" />
          <div className="border-b border-slate-400 border-dashed w-full" />
          <div className="border-b border-slate-400 border-dashed w-full" />
        </div>

        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
              const heightPercent = Math.max(item.value, hasTraffic ? 8 : 12);

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer z-10"
            >
              {/* Hover Tooltip Popup */}
              {isHovered && (
                <div className="absolute -top-12 z-30 px-3 py-1.5 rounded-xl bg-slate-950 text-white border border-cyan-400/50 shadow-2xl text-[11px] font-bold whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
                  <span className="text-cyan-400 font-mono">{item.actualVal} Visitors</span>
                  <span className="text-[9px] text-slate-400">{item.label} Traffic</span>
                </div>
              )}

              {/* 3D Cylindrical Pillar Column */}
              <div
                className="relative w-8 sm:w-12 transition-all duration-500 ease-out flex flex-col items-center"
                style={{
                  height: `${heightPercent}%`,
                  transform: isHovered ? "scale(1.08) translateY(-4px)" : "scale(1)"
                }}
              >
                {/* 3D Top Cap (Oval Ellipse) */}
                <div
                  className="w-full h-3 sm:h-4 rounded-[100%] shadow-md border-t border-white/40 transition-colors duration-300 relative z-20 shrink-0"
                  style={{ backgroundColor: item.topCapColor }}
                />

                {/* 3D Vertical Cylinder Body (Gradient Stem with Specular Sheen) */}
                <div
                  className={`w-full flex-1 bg-gradient-to-b ${item.bgGradient} relative overflow-hidden -mt-1 sm:-mt-2 shadow-xl border-x border-white/20`}
                  style={{
                    borderBottomLeftRadius: "100% 12px",
                    borderBottomRightRadius: "100% 12px"
                  }}
                >
                  {/* Vertical Cylindrical Light Sheen Highlight */}
                  <div className="absolute inset-y-0 left-1 w-1.5 bg-white/35 blur-[0.5px]" />
                  <div className="absolute inset-y-0 right-1 w-1 bg-black/20" />
                </div>

                {/* 3D Bottom Radial Drop Shadow */}
                <div className="w-10 sm:w-14 h-2 bg-black/60 rounded-full blur-xs -mt-1 shadow-2xl shrink-0" />
              </div>

              {/* Day Label */}
              <span className="mt-3 text-xs font-extrabold text-slate-700 dark:text-slate-300 group-hover:text-cyan-400 transition-colors">
                {item.label}
              </span>

            </div>
          );
        })}

      </div>

      {/* Legend / Color Breakdown Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
          <span>Mon</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
          <span>Tue</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
          <span>Wed (Peak)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm" />
          <span>Thu</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
          <span>Fri</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-teal-400 shadow-sm" />
          <span>Sat</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
          <span>Sun</span>
        </span>
      </div>

    </div>
  );
};
