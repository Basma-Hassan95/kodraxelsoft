"use client";

import React, { useRef, useState } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-[#111726] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 group ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Spotlight glow layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`
        }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500/0 group-hover:bg-cyan-400/80 transition-colors duration-300" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};
