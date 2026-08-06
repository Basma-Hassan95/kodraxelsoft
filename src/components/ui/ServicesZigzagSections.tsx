"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { serviceBackgroundImage } from "@/lib/serviceImages";
import type { Service } from "@/data/services";

const ease = [0.22, 1, 0.36, 1] as const;

type ZigRow = {
  title: string;
  body: string;
  image: string;
  imageLeft?: boolean;
};

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
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d]/25 via-transparent to-cyan-500/20 pointer-events-none z-10" />
      <div className="absolute -bottom-6 -right-6 text-[8rem] font-black text-[#004d4d]/10 dark:text-cyan-400/10 leading-none select-none z-0">
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

function ZigzagRow({ row, index }: { row: ZigRow; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay: 0.05, ease }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        row.imageLeft ? "" : ""
      }`}
    >
      <div className={row.imageLeft ? "lg:order-2" : "lg:order-1"}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#004d4d] dark:text-cyan-400 mb-3">
          Showcase 0{index + 1}
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {row.title}
        </h3>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {row.body}
        </p>
      </div>
      <div className={row.imageLeft ? "lg:order-1" : "lg:order-2"}>
        <ParallaxFigure src={row.image} alt={row.title} reverse={row.imageLeft} />
      </div>
    </motion.div>
  );
}

export const ServicesZigzagSections: React.FC<{ services: Service[] }> = ({
  services,
}) => {
  const a = services[0];
  const b = services[1] || services[0];
  if (!a) return null;

  const rows: ZigRow[] = [
    {
      title: "Connect Your Business Apps for Zero Manual Data Entry",
      body:
        "We connect your internal tools together so customer information moves smoothly. Stop copying numbers across spreadsheets and let smart systems run your back-office work.",
      image: serviceBackgroundImage(a),
      imageLeft: false,
    },
    {
      title: "We Build Smart Digital Assistants That Actually Work",
      body:
        "Custom digital assistants trained directly on your company knowledge base. They handle customer support 24/7, qualify prospective buyers, and manage bookings automatically.",
      image: serviceBackgroundImage(b || a),
      imageLeft: true,
    },
  ];

  return (
    <section className="space-y-20 md:space-y-28 py-4">
      {rows.map((row, i) => (
        <ZigzagRow key={`${row.title}-${i}`} row={row} index={i} />
      ))}
    </section>
  );
};
