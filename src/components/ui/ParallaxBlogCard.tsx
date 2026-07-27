"use client";

import React, { useRef, useEffect, useState } from "react";

interface ParallaxBlogCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ParallaxBlogCard: React.FC<ParallaxBlogCardProps> = ({
  children,
  className = "",
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHoveredState, setIsHoveredState] = useState(false);

  // Animation state refs for requestAnimationFrame loop
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    // High performance rAF loop
    const updateLoop = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.12);
      currentY.current = lerp(currentY.current, targetY.current, 0.12);

      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${currentX.current.toFixed(2)}deg) rotateY(${currentY.current.toFixed(2)}deg) scale3d(${isHovered.current ? 1.03 : 1}, ${isHovered.current ? 1.03 : 1}, 1)`;
      }

      const diffX = Math.abs(targetX.current - currentX.current);
      const diffY = Math.abs(targetY.current - currentY.current);

      if (isHovered.current || diffX > 0.01 || diffY > 0.01) {
        animFrameId.current = requestAnimationFrame(updateLoop);
      } else {
        currentX.current = 0;
        currentY.current = 0;
        if (card) {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        }
        animFrameId.current = null;
      }
    };

    const startLoopIfNeeded = () => {
      if (!animFrameId.current) {
        animFrameId.current = requestAnimationFrame(updateLoop);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Pronounced 15 deg 3D tilt angle
      targetX.current = ((y - centerY) / centerY) * -15;
      targetY.current = ((x - centerX) / centerX) * 15;

      startLoopIfNeeded();
    };

    const handleMouseEnter = () => {
      isHovered.current = true;
      setIsHoveredState(true);
      startLoopIfNeeded();
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      setIsHoveredState(false);
      targetX.current = 0;
      targetY.current = 0;
      startLoopIfNeeded();
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
      className={`parallax-blog-card relative transition-all duration-300 ${
        isHoveredState ? "is-hovered" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
