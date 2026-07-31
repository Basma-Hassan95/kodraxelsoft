"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showHeader = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidth =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-2xl";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-300/80 dark:border-slate-700/80 bg-white dark:bg-[#111726] p-6 sm:p-8 shadow-2xl transition-all animate-scaleUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && (
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200 dark:border-slate-800">
            {title ? (
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className={showHeader ? "mt-4" : ""}>{children}</div>
      </div>
    </div>
  );
};
