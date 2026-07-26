"use client";

import React from "react";

interface LogoProps {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "full", size = "md", className = "" }) => {
  // Prominent height configurations for crystal-clear readability
  const heightClasses = {
    sm: "h-11 sm:h-12",
    md: "h-14 sm:h-16",
    lg: "h-18 sm:h-20",
    xl: "h-24 sm:h-28"
  };

  const markSizeClasses = {
    sm: "w-11 h-11",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28"
  };

  if (variant === "mark") {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg border-2 border-slate-200 dark:border-cyan-400/60 ring-2 ring-cyan-500/20 group-hover:scale-105 transition-transform duration-300 ${markSizeClasses[size]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Kodraxelsoft Emblem"
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center group-hover:scale-105 transition-transform duration-300 ${className}`}>
      <div className={`relative overflow-hidden rounded-2xl bg-white p-1.5 sm:p-2 shadow-xl border-2 border-slate-200 dark:border-cyan-400/60 ring-2 ring-cyan-500/20 flex items-center justify-center ${heightClasses[size]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="KODRAXEL SOFT Official Logo"
          className="h-full w-auto object-contain rounded-xl drop-shadow-sm"
        />
      </div>
    </div>
  );
};
