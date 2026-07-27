"use client";

import React, { useEffect } from "react";
import { X, Film } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  title = "Kodraxelsoft AI Logo Reveal"
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
      {/* Dark Glassmorphic Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-cyan-500/40 bg-slate-900/90 dark:bg-[#111726]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Film className="w-4 h-4 text-cyan-400" />
            <span>{title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-[#004d4d] text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400 transition-all duration-200 focus:outline-none"
            aria-label="Close video modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-inner">
          <video
            src={videoSrc}
            autoPlay
            controls
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

      </div>
    </div>
  );
};
