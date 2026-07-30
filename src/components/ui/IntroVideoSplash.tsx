"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX, ArrowRight } from "lucide-react";

export const IntroVideoSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user has already seen intro video in current session
    const hasSeenIntro = sessionStorage.getItem("kodraxelsoft_intro_seen");
    if (!hasSeenIntro) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    sessionStorage.setItem("kodraxelsoft_intro_seen", "true");
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }, 500); // 500ms fade-out duration
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#070a12] flex flex-col justify-between p-4 sm:p-8 select-none transition-opacity duration-500 ease-in-out overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      
      {/* 1. MOBILE VIEW: Edge-to-Edge Fullscreen Video (Crisp & Super Sharp on Mobile screens) */}
      <div className="block md:hidden absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={mobileVideoRef}
          src="/video1.mp4"
          autoPlay
          playsInline
          preload="auto"
          disablePictureInPicture
          muted={isMuted}
          onEnded={handleClose}
          className="w-full h-full object-cover transform-gpu"
        />
        {/* Subtle Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* 2. DESKTOP VIEW: Smart 3D Cinema Glass Container + Ambient Motion Backdrop (Prevents Desktop Pixel Stretching) */}
      <div className="hidden md:flex absolute inset-0 z-0 items-center justify-center overflow-hidden bg-[#070a12]">
        {/* Ambient Motion Glow Backdrop */}
        <video
          src="/video1.mp4"
          autoPlay
          loop
          playsInline
          muted
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-[90px] opacity-35 scale-125 pointer-events-none"
        />
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />

        {/* 3D Glassmorphic Cinema Stage Frame */}
        <div className="relative z-10 w-full max-w-4xl aspect-video max-h-[72vh] rounded-3xl overflow-hidden border border-cyan-500/40 bg-black/90 shadow-[0_0_90px_rgba(0,128,128,0.4)] backdrop-blur-2xl flex items-center justify-center transform-gpu">
          <video
            ref={desktopVideoRef}
            src="/video1.mp4"
            autoPlay
            playsInline
            preload="auto"
            disablePictureInPicture
            muted={isMuted}
            onEnded={handleClose}
            className="w-full h-full object-contain rounded-3xl transform-gpu"
          />
          {/* Glossy Frame Overlay */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
        </div>
      </div>

      {/* Top Header Controls Bar */}
      <div className="relative z-20 flex items-center justify-between sm:justify-end w-full max-w-7xl mx-auto">
        
        {/* Mobile Brand Badge */}
        <div className="flex md:hidden items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Intro</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-[#004d4d] text-white border border-slate-700 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 focus:outline-none flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold"
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-slate-300">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-cyan-300">Muted</span>
              </>
            )}
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleClose}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-[11px] sm:text-xs border border-cyan-400/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none flex items-center gap-1.5 sm:gap-2"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Close Cross Button */}
          <button
            onClick={handleClose}
            className="p-2 sm:p-2.5 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 backdrop-blur-md transition-all duration-300 focus:outline-none shrink-0"
            aria-label="Close intro video"
          >
            <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Brand Bar & Hint */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full text-center sm:text-left">
        <div>
          <div className="text-lg sm:text-2xl font-extrabold text-white tracking-wider">
            KODRAXELSOFT
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Ultra-Premium AI Architecture & Software Studio
          </div>
        </div>

        <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-2">
          <span>Click cross or Skip Intro to enter website</span>
        </div>
      </div>

    </div>
  );
};
