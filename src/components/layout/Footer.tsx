"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, ArrowRight, CheckCircle2, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-slate-300/80 dark:border-slate-800/80 bg-slate-100 dark:bg-[#070a12] pt-16 pb-12 overflow-hidden">
      {/* Glow Background Gradient */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-300/60 dark:border-slate-800/60">
          
          {/* Col 1: Brand & Status */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#004d4d] flex items-center justify-center text-white shadow-md border border-[#006666]/50">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                KODRAXELSOFT
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Ultra-premium corporate software engineering studio crafting next-gen Web Apps, AI Systems, and Cloud Architectures for enterprise leaders.
            </p>
            
            {/* Live Operational System Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • SLA 99.99%</span>
            </div>
          </div>

          {/* Col 2: Navigation Sitemap */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Sitemap
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Services & Pricing</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">About 4 Founders</Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Case Studies</Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Agile Process</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Careers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/careers" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Engineering Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Lead Contact</Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">San Francisco, CA</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Brief Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Engineering Brief
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Subscribe for monthly architectural case studies & Next.js/AI insights.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed to Brief!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
                <Button variant="teal-gradient" size="sm" className="w-full justify-center text-xs">
                  Subscribe
                </Button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Kodraxelsoft Inc. All rights reserved. Built with Next.js 16 & GSAP.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
