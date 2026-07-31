"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const iconBoxSizes = {
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-11 h-11 sm:w-12 sm:h-12",
  };

  const textSizes = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl font-extrabold",
    lg: "text-2xl sm:text-3xl font-extrabold",
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}
    >
      <div
        className={`relative rounded-xl bg-slate-950 dark:bg-black p-1 shadow-md border border-slate-200/80 dark:border-cyan-500/40 ring-1 ring-black/5 dark:ring-cyan-400/20 group-hover:scale-105 transition-transform duration-300 shrink-0 overflow-hidden ${iconBoxSizes[size]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ks-emblem.png"
          alt="Kodraxelsoft"
          className="w-full h-full object-contain"
        />
      </div>

      <span
        className={`tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 ${textSizes[size]}`}
      >
        KODRAXELSOFT
        <span className="w-2 h-2 rounded-full bg-[#008080] animate-pulse" />
      </span>
    </div>
  );
};
