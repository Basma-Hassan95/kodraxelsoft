"use client";

import React, { useRef, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: theme === "dark" ? 360 : -360,
        scale: 0.8,
        duration: 0.25,
        ease: "back.in(2)",
        onComplete: () => {
          toggleTheme(e);
          gsap.to(iconRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(2)"
          });
        }
      });
    } else {
      toggleTheme(e);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm"
      aria-label="Toggle Dark and Light Mode"
    >
      <div ref={iconRef} className="flex items-center justify-center w-5 h-5">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        ) : (
          <Moon className="w-5 h-5 text-slate-800 drop-shadow-[0_0_8px_rgba(15,23,42,0.2)]" />
        )}
      </div>
    </button>
  );
};
