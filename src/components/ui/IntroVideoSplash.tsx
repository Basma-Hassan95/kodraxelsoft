"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX, ArrowRight, Sparkles } from "lucide-react";

export const IntroVideoSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col justify-between p-4 sm:p-8 select-none transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          src="/video1.mp4"
          autoPlay
          playsInline
          muted={isMuted}
          onEnded={handleClose}
          className="w-full h-full object-cover sm:object-contain"
        />
        {/* Subtle Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
      </div>

      {/* Top Header Controls Bar */}
      <div className="relative z-10 flex items-center justify-end w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-[#004d4d] text-white border border-slate-700 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 focus:outline-none flex items-center gap-2 text-xs font-semibold"
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
            className="px-4 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs border border-cyan-400/50 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none flex items-center gap-2"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Close Cross Button */}
          <button
            onClick={handleClose}
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 backdrop-blur-md transition-all duration-300 focus:outline-none"
            aria-label="Close intro video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Brand Bar & Hint */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full text-center sm:text-left">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-wider">
            KODRAXELSOFT
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Ultra-Premium AI Architecture & Software Studio
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Click cross or Skip Intro to enter website</span>
        </div>
      </div>
    </div>
  );
};
