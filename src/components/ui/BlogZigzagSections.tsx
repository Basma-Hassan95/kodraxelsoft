"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { BlogPost } from "@/data/blog";

const ease = [0.22, 1, 0.36, 1] as const;

const FALLBACK_A =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200";
const FALLBACK_B =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

function ParallaxFigure({
  src,
  alt,
  reverse,
}: {
  src: string;
  alt: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reverse ? [40, -40] : [-36, 36]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.04]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-slate-100 dark:bg-slate-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d]/20 via-transparent to-cyan-500/15 pointer-events-none z-10" />
      <div className="absolute -bottom-8 -right-4 text-[9rem] font-black text-[#004d4d]/10 dark:text-cyan-400/10 leading-none select-none z-0">
        K
      </div>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 h-[120%] w-full object-cover -top-[10%]"
      />
    </div>
  );
}

export const BlogZigzagSections: React.FC<{ posts: BlogPost[] }> = ({
  posts,
}) => {
  const a = posts[0];
  const b = posts[1] || posts[0];

  const rows = [
    {
      title: a?.title || "Engineering Insights & Deep Dives",
      body:
        a?.excerpt ||
        "Practical architecture notes, performance benchmarks, and delivery playbooks from our principal engineers — written for builders who ship.",
      image: a?.image || FALLBACK_A,
      imageLeft: false,
      label: "01 · Featured Insight",
    },
    {
      title: b
        ? "We Publish Knowledge That Actually Ships"
        : "We Publish Knowledge That Actually Ships",
      body:
        b?.excerpt ||
        "Every article is grounded in production work — Next.js, AI systems, cloud, and motion design — so you can apply it the same day.",
      image: b?.image || FALLBACK_B,
      imageLeft: true,
      label: "02 · Studio Voice",
    },
  ];

  return (
    <section className="space-y-20 md:space-y-28">
      {rows.map((row, index) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.05, ease }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <div className={row.imageLeft ? "lg:order-2" : "lg:order-1"}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#004d4d] dark:text-cyan-400 mb-3">
              {row.label}
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {row.title}
            </h3>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {row.body}
            </p>
          </div>
          <div className={row.imageLeft ? "lg:order-1" : "lg:order-2"}>
            <ParallaxFigure
              src={row.image}
              alt={row.title}
              reverse={row.imageLeft}
            />
          </div>
        </motion.div>
      ))}
    </section>
  );
};
