"use client";

import React, { useRef, useState } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className = "", onClick, id }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate 3D perspective tilt angles with smooth limits
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7; // 7 deg max tilt
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered ? transformStyle : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d"
      }}
      className={`relative overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-[#111726] p-6 shadow-xl hover:shadow-2xl dark:hover:shadow-[#004d4d]/30 hover:border-[#004d4d] dark:hover:border-cyan-500/50 group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Spotlight glow layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 128, 128, 0.18), transparent 45%)`
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004d4d]/0 group-hover:bg-[#004d4d] dark:group-hover:bg-cyan-400 transition-colors duration-300" />

      {/* Parallax Content Layer */}
      <div className="relative z-10" style={{ transform: "translateZ(12px)" }}>
        {children}
      </div>
    </div>
  );
};
