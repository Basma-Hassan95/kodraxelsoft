"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/SocialIcons";
import type { SiteSettings } from "@/types/admin";
import {
  DEFAULT_SITE_SETTINGS,
  toWhatsAppNumber,
} from "@/lib/siteSettings";
import { CMS_API_BASE } from "@/lib/cmsApi";

type FooterProps = {
  settings?: SiteSettings;
};

export const Footer: React.FC<FooterProps> = ({
  settings = DEFAULT_SITE_SETTINGS,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${CMS_API_BASE}/public/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(
          json?.message || "Could not subscribe. Please try again."
        );
      }
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscribe failed");
    } finally {
      setSubmitting(false);
    }
  };

  const company = settings.companyName || DEFAULT_SITE_SETTINGS.companyName;
  const phone =
    settings.contactPhone?.trim() || DEFAULT_SITE_SETTINGS.contactPhone;
  const emailAddr =
    settings.contactEmail?.trim() || DEFAULT_SITE_SETTINGS.contactEmail;
  const instagram =
    settings.instagramUrl?.trim() || DEFAULT_SITE_SETTINGS.instagramUrl;
  const linkedin =
    settings.linkedinUrl?.trim() || DEFAULT_SITE_SETTINGS.linkedinUrl;
  const facebook =
    settings.facebookUrl?.trim() || DEFAULT_SITE_SETTINGS.facebookUrl;
  const waNumber = toWhatsAppNumber(phone);
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi ${company}, I would like to inquire about your services.`
  )}`;

  return (
    <footer className="relative border-t border-slate-300/80 dark:border-slate-800/80 bg-slate-100 dark:bg-[#070a12] pt-16 pb-12 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-300/60 dark:border-slate-800/60">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Kodraxelsoft builds fast, clean custom software and smart AI tools that save time and boost sales for growing businesses.
            </p>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              {emailAddr && (
                <a
                  href={`mailto:${emailAddr}`}
                  className="block hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                >
                  {emailAddr}
                </a>
              )}
              {phone && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    {phone}
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • SLA 99.99%</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Sitemap
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Services & Capabilities</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">About Studio</Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Agile Process</Link>
              </li>
            </ul>
          </div>

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
                <Link href="/contact" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Leave a Review
                </Link>
              </li>
            </ul>
          </div>

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
                  disabled={submitting}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-60"
                />
                {error && (
                  <p className="text-[11px] text-rose-500 font-medium">{error}</p>
                )}
                <Button
                  variant="teal-gradient"
                  size="sm"
                  className="w-full justify-center text-xs"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Subscribing…
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} {company}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
