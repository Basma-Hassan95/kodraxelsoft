"use client";

import React, { useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";

/**
 * Single site-wide light/dark toggle.
 * Same control on public site + admin — updates `html.dark` + localStorage.
 */
export const ThemeToggle: React.FC<{ className?: string; label?: boolean }> = ({
  className = "",
  label = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 1, rotate: 0 },
        {
          scale: 0.85,
          rotate: theme === "dark" ? 20 : -20,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={
        className ||
        "relative p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm inline-flex items-center gap-2"
      }
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <div ref={iconRef} className="flex items-center justify-center w-5 h-5">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        ) : (
          <Moon className="w-5 h-5 text-slate-800 drop-shadow-[0_0_8px_rgba(15,23,42,0.2)]" />
        )}
      </div>
      {label && (
        <span className="text-xs font-bold">
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
};
