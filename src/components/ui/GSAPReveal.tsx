"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
}

export const GSAPReveal: React.FC<GSAPRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
  stagger = 0
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    if (direction === "up") y = 24;
    if (direction === "down") y = -24;
    if (direction === "left") x = 24;
    if (direction === "right") x = -24;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length > 0 ? Array.from(el.children) : el;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          x,
          y,
          scale: direction === "none" ? 0.96 : 1
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, stagger]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};
