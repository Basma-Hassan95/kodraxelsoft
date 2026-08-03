"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePublicServices } from "@/hooks/usePublicCms";
import { serviceBackgroundImage } from "@/lib/serviceImages";
import { ArrowRight } from "lucide-react";

const ctaClassName =
  "inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white shadow-md border border-[#226263]/50 transition-colors";

function activateOnKey(
  e: React.KeyboardEvent,
  activate: () => void
) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    activate();
  }
}

export const ServicesAccordion: React.FC = () => {
  const services = usePublicServices();
  const [active, setActive] = useState(0);

  if (!services.length) return null;

  return (
    <div className="w-full">
      <div className="hidden md:flex h-[420px] lg:h-[480px] gap-2.5">
        {services.map((service, index) => {
          const isOpen = active === index;
          const slug = service.slug || service.id;
          const img = serviceBackgroundImage(service);
          return (
            <motion.div
              key={service.id}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={service.title}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              onKeyDown={(e) => activateOnKey(e, () => setActive(index))}
              animate={{ flexGrow: isOpen ? 4.2 : 0.7 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-700/60 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{ flexBasis: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                  isOpen ? "scale-105" : "scale-110"
                }`}
              />
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  isOpen ? "bg-[#041628]/55" : "bg-[#041628]/78"
                }`}
              />

              {!isOpen && (
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90 [writing-mode:vertical-rl] rotate-180">
                    {String(index + 1).padStart(2, "0")} · {service.title}
                  </span>
                </div>
              )}

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                  className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight max-w-lg">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-200/90 leading-relaxed max-w-md line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-6 text-white">
                    <div>
                      <div className="text-lg font-extrabold text-cyan-300">
                        {service.basePrice}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-300">
                        Starting at
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-cyan-300">
                        {service.estimatedWeeks}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-300">
                        Typical timeline
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/services/${slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={ctaClassName}
                    >
                      View Service
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="md:hidden space-y-3">
        {services.map((service, index) => {
          const slug = service.slug || service.id;
          const img = serviceBackgroundImage(service);
          const isOpen = active === index;
          return (
            <div
              key={service.id}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={service.title}
              onClick={() => setActive(index)}
              onKeyDown={(e) => activateOnKey(e, () => setActive(index))}
              className="relative w-full overflow-hidden rounded-2xl border border-slate-700/60 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div
                className={`relative ${isOpen ? "h-64" : "h-16"} transition-all duration-500`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#041628]/70" />
                {!isOpen ? (
                  <div className="relative z-10 h-full flex items-center px-4">
                    <span className="text-sm font-bold text-white">
                      {String(index + 1).padStart(2, "0")} · {service.title}
                    </span>
                  </div>
                ) : (
                  <div className="relative z-10 h-full flex flex-col justify-end p-5">
                    <h3 className="text-xl font-extrabold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-200 line-clamp-3">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`mt-3 ${ctaClassName}`}
                    >
                      View Service
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
