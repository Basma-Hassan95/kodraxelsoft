"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  APPLICATION_STATUSES,
  applicationStatusClass,
  type ApplicationStatus,
} from "@/lib/applicationStatus";

type Props = {
  value: string;
  onChange: (status: string) => void;
  statuses?: readonly string[];
  className?: string;
  size?: "sm" | "md";
};

/**
 * Themed status picker for admin — matches Kodraxelsoft teal/dark chrome.
 * Native <select> option menus ignore dark theme on Windows; this custom menu does not.
 */
export function AdminStatusSelect({
  value,
  onChange,
  statuses = APPLICATION_STATUSES,
  className = "",
  size = "sm",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = String(value || statuses[0] || "new");

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pad = size === "md" ? "px-3 py-2" : "px-2.5 py-1.5";
  const text = size === "md" ? "text-xs" : "text-[11px]";

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 ${pad} rounded-xl border ${text} font-bold uppercase tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004d4d]/50 dark:focus-visible:ring-cyan-500/40 ${applicationStatusClass(current)}`}
      >
        <span className="max-w-[7.5rem] truncate">{current}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 right-0 mt-1.5 min-w-[11rem] max-h-60 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1220] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.55)] p-1"
        >
          {statuses.map((s) => {
            const active = s === current;
            return (
              <li key={s} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors ${
                    active
                      ? applicationStatusClass(s)
                      : "text-slate-700 dark:text-slate-200 hover:bg-[#004d4d]/8 dark:hover:bg-cyan-500/10"
                  }`}
                >
                  {s}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export type { ApplicationStatus };
