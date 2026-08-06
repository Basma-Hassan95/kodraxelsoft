"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Service } from "@/data/services";
import { serviceBackgroundImage } from "@/lib/serviceImages";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

/**
 * Services page cards — image backgrounds with a clip-path / tilt reveal
 * (different from the homepage vertical accordion).
 */
export const ServicesImageCards: React.FC<{ services: Service[] }> = ({
  services,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => {
        const slug = service.slug || service.id;
        const img = serviceBackgroundImage(service);
        return (
          <motion.article
            key={service.id}
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay: index * 0.07,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -8 }}
            className="group relative h-[420px] rounded-3xl overflow-hidden border border-slate-700/50 shadow-xl perspective-[1200px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041628] via-[#041628]/75 to-[#041628]/25 transition-opacity duration-500 group-hover:via-[#041628]/85" />

            {/* Accent sweep on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(32,178,170,0.25),transparent_55%)]" />

            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <motion.div
                initial={false}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-300/90">
                  {service.subtitle}
                </p>
                <p className="text-sm text-slate-200/90 leading-relaxed line-clamp-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-semibold text-white/90 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/15 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <Link href={`/services/${slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full justify-center border-white/30 text-white hover:bg-white/10">
                      View Details
                    </Button>
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(slug)}&serviceName=${encodeURIComponent(service.title)}`}
                    className="flex-1"
                  >
                    <Button
                      variant="teal-gradient"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="w-full justify-center"
                    >
                      Contact →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
