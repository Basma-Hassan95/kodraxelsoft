"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const iconSizes = {
    sm: "w-9 h-9",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl"
  };

  return (
    <div className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}>
      {/* Metallic KS Emblem Badge */}
      <div className={`relative overflow-hidden rounded-xl bg-white p-0.5 shadow-md border border-slate-200 dark:border-cyan-500/40 ring-1 ring-black/5 dark:ring-cyan-400/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="KS Emblem"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Crisp Bold Corporate Branding Text */}
      <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 ${textSizes[size]}`}>
        KODRAXELSOFT
        <span className="w-2 h-2 rounded-full bg-[#008080] animate-pulse" />
      </span>
    </div>
  );
};
