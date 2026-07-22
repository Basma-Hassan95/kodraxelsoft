"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Set initial position offscreen
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // GSAP quickTo setters for ultra 60 FPS performance
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) {
        setVisible(true);
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }

      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      gsap.to(ring, { scale: 0.7, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 0.5, duration: 0.15, ease: "power2.out" });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      gsap.to(ring, { scale: isHovered ? 1.8 : 1, duration: 0.2, ease: "back.out(2)" });
      gsap.to(dot, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    };

    const handleMouseLeave = () => {
      setVisible(false);
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      setVisible(true);
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    // Attach event listeners for interactive elements hover detection
    const handleElementHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
      if (interactive) {
        setIsHovered(true);
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "rgba(6, 182, 212, 0.8)",
          backgroundColor: "rgba(6, 182, 212, 0.12)",
          duration: 0.25,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 1.4,
          backgroundColor: "#38bdf8",
          duration: 0.25
        });
      }
    };

    const handleElementHoverEnd = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
      if (interactive) {
        setIsHovered(false);
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(6, 182, 212, 0.4)",
          backgroundColor: "rgba(6, 182, 212, 0.04)",
          duration: 0.25,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#06b6d4",
          duration: 0.25
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleElementHoverStart);
    document.addEventListener("mouseout", handleElementHoverEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleElementHoverStart);
      document.removeEventListener("mouseout", handleElementHoverEnd);
    };
  }, [visible, isHovered]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Outer Floating Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-cyan-500/40 bg-cyan-500/5 backdrop-blur-[1px] shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors duration-200"
      />
      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
      />
    </div>
  );
};
