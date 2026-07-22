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
  duration = 0.8,
  className = "",
  stagger = 0
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    if (direction === "up") y = 40;
    if (direction === "down") y = -40;
    if (direction === "left") x = 40;
    if (direction === "right") x = -40;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children.length > 1 && stagger > 0 ? el.children : el,
        {
          opacity: 0,
          x,
          y,
          scale: direction === "none" ? 0.95 : 1
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "power3.out",
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
