"use client";

import React, { useEffect, useState } from "react";

type ScrollPreviewImageProps = {
  src: string;
  alt: string;
  /** Tailwind height class for the fixed preview window (default h-52 / 13rem) */
  heightClassName?: string;
  /** Must match heightClassName — used in translate calc */
  heightRem?: string;
  /** How long the top→bottom scroll takes */
  durationMs?: number;
  className?: string;
};

/**
 * Fixed-height card window + taller full-page screenshot.
 * Hover or click scrolls the homepage image top → bottom; card height stays fixed.
 */
export function ScrollPreviewImage({
  src,
  alt,
  heightClassName = "h-52",
  heightRem = "13rem",
  durationMs = 3500,
  className = "",
}: ScrollPreviewImageProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), durationMs + 400);
    return () => window.clearTimeout(timer);
  }, [playing, durationMs]);

  const handleActivate = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaying(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Preview ${alt} — click to scroll full page`}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleActivate(e);
      }}
      className={`group/preview relative w-full ${heightClassName} overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 cursor-pointer ${className}`}
      style={{ ["--preview-h" as string]: heightRem }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-auto min-h-full max-w-none will-change-transform ease-[cubic-bezier(0.25,0.1,0.25,1)] transition-transform group-hover/preview:translate-y-[calc(-100%+var(--preview-h))] ${
          playing ? "translate-y-[calc(-100%+var(--preview-h))]" : "translate-y-0"
        }`}
        style={{ transitionDuration: `${durationMs}ms` }}
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent opacity-70" />
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-sm text-[10px] font-semibold text-cyan-300 border border-cyan-500/30 opacity-90 group-hover/preview:opacity-0 transition-opacity">
        Click to scroll
      </div>
    </div>
  );
}
