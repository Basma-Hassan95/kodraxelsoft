"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.2,
  className = ""
}) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(obj.current, {
        val: target,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          if (el) {
            el.innerText = `${prefix}${obj.current.val.toFixed(decimals)}${suffix}`;
          }
        }
      });
    }, el);

    return () => ctx.revert();
  }, [target, suffix, prefix, decimals, duration]);

  return (
    <span ref={countRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
};
