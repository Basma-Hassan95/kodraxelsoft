"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const ACCENT = "#1C9994";

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200";

export const HomeAboutSection: React.FC = () => {
  return (
    <section
      id="home-about"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes about-glow-orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .about-glow-orbit {
              animation: about-glow-orbit 8s linear infinite;
            }
          `,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: ACCENT }}
          >
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Software Built for{" "}
            <span style={{ color: ACCENT }}>Real Business Results</span>
          </h2>
          <div
            className="w-16 h-1.5 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            We build custom digital tools that are extremely easy for you and your
            team to use. No confusing tech jargon—just software that helps your
            business run smoother and faster.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Whether you need a simple custom website or an intelligent assistant to
            manage daily work, we create solutions that grow alongside your
            business.
          </p>

          <div className="pt-2">
            <Link href="/contact">
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="shadow-[0_0_28px_rgba(28,153,148,0.4)] !bg-[#1C9994] hover:!bg-[#17807c] !border-[#1C9994]/50"
              >
                Book A Free Consultation
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center lg:justify-end py-12 lg:py-10"
        >
          <div className="relative w-full max-w-[400px] aspect-square">
            {/* Single-side glow that orbits — only one edge lit at a time */}
            <div
              aria-hidden
              className="about-glow-orbit pointer-events-none absolute inset-0 z-0"
            >
              <div
                className="absolute left-1/2 top-0"
                style={{
                  width: "52%",
                  height: "26%",
                  marginLeft: "-26%",
                  marginTop: "-10%",
                  background: `radial-gradient(ellipse 100% 80% at 50% 60%, ${ACCENT}f0 0%, ${ACCENT}b0 50%, transparent 78%)`,
                  /* One side wider oval / soft teardrop */
                  borderRadius: "60% 60% 45% 45% / 85% 85% 25% 25%",
                  filter: "blur(4px)",
                  transform: "scaleX(1.4) scaleY(0.75)",
                }}
              />
            </div>

            <div className="relative z-10 w-full h-full rounded-[2rem] bg-white dark:bg-[#111726] shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div
                className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-lg border"
                style={{
                  backgroundColor: "rgba(28,153,148,0.12)",
                  borderColor: "rgba(28,153,148,0.35)",
                }}
              >
                <span
                  className="text-[10px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: ACCENT }}
                >
                  Mobile App Development
                </span>
              </div>

              <div
                className="absolute top-8 right-8 w-24 h-24 rounded-full border border-dashed z-10"
                style={{ borderColor: "rgba(28,153,148,0.35)" }}
              />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_IMAGE}
                alt="Mobile app development"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041628]/50 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
