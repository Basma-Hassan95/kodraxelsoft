"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX, ArrowRight } from "lucide-react";

export const IntroVideoSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("kodraxelsoft_intro_seen");
    if (!hasSeenIntro) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = videoRef.current;
    if (!el) return;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    void el.play().catch(() => {
      /* autoplay may be blocked until interaction */
    });
  }, [isVisible]);

  const handleClose = () => {
    setIsFadingOut(true);
    sessionStorage.setItem("kodraxelsoft_intro_seen", "true");
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col select-none transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Top controls */}
      <div className="relative z-20 shrink-0 flex items-center justify-end gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4">
        <button
          type="button"
          onClick={() => setIsMuted((m) => !m)}
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-[#004d4d] text-white border border-slate-700 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 focus:outline-none flex items-center gap-2 text-xs font-semibold"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline text-slate-300">Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline text-cyan-300">Mute</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="px-3 sm:px-4 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs border border-cyan-400/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none flex items-center gap-2"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="p-2.5 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 backdrop-blur-md transition-all duration-300 focus:outline-none"
          aria-label="Close intro video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Responsive video stage — contain (no stretch) so 480p stays sharper */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-3 sm:px-6 md:px-10">
        <div className="relative w-full max-w-[min(100%,1100px)] max-h-full">
          <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800/80 bg-black shadow-[0_0_40px_rgba(0,77,77,0.25)] aspect-video">
            <video
              ref={videoRef}
              src="/video1.mp4"
              autoPlay
              playsInline
              muted={isMuted}
              preload="auto"
              controls={false}
              disablePictureInPicture
              onEnded={handleClose}
              className="absolute inset-0 h-full w-full object-contain bg-black"
              style={{
                /* Prefer crisp presentation; avoid soft upscale filters */
                filter: "none",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom brand bar */}
      <div className="relative z-20 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-5 max-w-7xl mx-auto w-full text-center sm:text-left">
        <div>
          <div className="text-lg sm:text-2xl font-extrabold text-white tracking-wider">
            KODRAXELSOFT
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Ultra-Premium AI Architecture & Software Studio
          </div>
        </div>
        <div className="text-[10px] sm:text-xs text-slate-500">
          Skip Intro to enter the website
        </div>
      </div>
    </div>
  );
};
