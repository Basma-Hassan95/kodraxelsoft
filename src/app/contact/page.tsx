"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { ContactProjectBrief } from "@/components/ui/ContactProjectBrief";
import {
  AESTHETIC_OPTIONS,
  DEFAULT_PROJECT_BRIEF,
  DESIGN_OPTIONS,
  DOMAIN_HOSTING_OPTIONS,
  INTEGRATION_OPTIONS,
  TIMELINE_OPTIONS,
  labelOf,
  type ProjectBriefAnswers,
} from "@/lib/contactBriefOptions";
import confetti from "canvas-confetti";
import {
  Mail,
  Phone,
  CheckCircle2,
  Send,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Briefcase,
} from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams?.get("service") || "";
  const serviceName = searchParams?.get("serviceName") || "";
  const pricingPlan = searchParams?.get("plan") || "";
  const quotedPrice = searchParams?.get("price") || "";
  const compareAtPrice = searchParams?.get("compareAt") || "";
  const discountPercent = searchParams?.get("discount") || "";
  const hasExactQuote = Boolean(quotedPrice.trim());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState(() => {
    if (pricingPlan && quotedPrice) {
      return `I want the ${pricingPlan} plan at ${quotedPrice}. `;
    }
    if (serviceName) return `I'm interested in: ${serviceName}. `;
    return "";
  });
  const [brief, setBrief] = useState<ProjectBriefAnswers>(DEFAULT_PROJECT_BRIEF);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(name && email && phone)) return;
    setSubmitting(true);
    setError("");
    const details = description.trim();

    try {
      const { submitPublicOrder } = await import("@/lib/publicContent");
      await submitPublicOrder({
        client_name: name.trim(),
        client_email: email.trim(),
        client_phone: phone.trim(),
        project_type: serviceName || pricingPlan || "General inquiry",
        budget: hasExactQuote ? quotedPrice.trim() : undefined,
        details,
        metadata: {
          source: pricingPlan
            ? "pricing_page"
            : serviceSlug
              ? "service_page"
              : "contact_page",
          service_slug: serviceSlug || undefined,
          service_name: serviceName || undefined,
          pricing_plan: pricingPlan || undefined,
          quoted_price: hasExactQuote ? quotedPrice.trim() : undefined,
          compare_at_price: compareAtPrice || undefined,
          discount_percent: discountPercent || undefined,
          design_source: brief.designReady,
          color_theme: labelOf(AESTHETIC_OPTIONS, brief.aesthetic),
          reference_website: brief.referenceWebsite.trim() || undefined,
          domain_hosting: brief.domainHosting,
          integrations: brief.integrations,
          timeline: brief.timeline,
          additional_specs: brief.additionalSpecs.trim() || undefined,
          design_ready_label: labelOf(DESIGN_OPTIONS, brief.designReady),
          domain_hosting_label: labelOf(
            DOMAIN_HOSTING_OPTIONS,
            brief.domainHosting
          ),
          integrations_label: labelOf(INTEGRATION_OPTIONS, brief.integrations),
          timeline_label: labelOf(TIMELINE_OPTIONS, brief.timeline),
        },
      });
      setSubmitted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Inquiry Received!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Thank you, <strong>{name}</strong>
          {hasExactQuote ? (
            <>
              . Quote noted:{" "}
              <strong className="text-[#004d4d] dark:text-cyan-400">
                {quotedPrice}
              </strong>
            </>
          ) : null}
          . We will contact you at <strong>{email}</strong> /{" "}
          <strong>{phone}</strong> within 24 hours.
        </p>
        <Button
          variant="teal-gradient"
          size="md"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <GlowCard className="p-8 sm:p-10">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {(serviceName || pricingPlan || hasExactQuote) && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#004d4d]/10 border border-[#004d4d]/30 text-[#004d4d] dark:text-cyan-400">
            <Briefcase className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-xs font-semibold space-y-1">
              {serviceName && (
                <p>
                  From: <span className="font-extrabold">{serviceName}</span>
                </p>
              )}
              {pricingPlan && (
                <p>
                  Plan: <span className="font-extrabold">{pricingPlan}</span>
                </p>
              )}
              {hasExactQuote && (
                <p>
                  Agreed quote:{" "}
                  <span className="font-extrabold text-base">{quotedPrice}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">
            Phone / WhatsApp *
          </label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+92 300 0000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">
            What kind of website / product do you want? *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            placeholder="Describe the website or product you want built…"
          />
        </div>

        <ContactProjectBrief value={brief} onChange={setBrief} />

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="teal-gradient"
          size="lg"
          disabled={submitting}
          icon={<Send className="w-5 h-5" />}
          className="w-full justify-center"
        >
          {submitting ? "Sending…" : "Submit Project Request"}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
          Strict NDA Protection & 24-Hour Response
        </div>
      </form>
    </GlowCard>
  );
}

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isContactMuted, setIsContactMuted] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { getSiteSettings } = await import("@/lib/siteSettings");
        const live = await getSiteSettings();
        if (!cancelled) setSettings(live);
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const faqs = [
    {
      q: "Who handles our project technical execution?",
      a: "You work 1-on-1 exclusively with our senior principal architects. We do not use account managers or offshore sub-contractors.",
    },
    {
      q: "What is your standard project delivery timeline?",
      a: "Most Next.js Web App and AI integration projects take between 3 to 6 weeks from initial architecture blueprinting to production edge cutover.",
    },
    {
      q: "Do you offer post-launch code warranties & SLAs?",
      a: "Yes. Every contract includes a 30-day full code warranty and an optional continuous SLA maintenance retainer.",
    },
    {
      q: "How do we get started after submitting this form?",
      a: "Within 24 hours, our team will schedule a discovery call to review your requirements and project brief.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      <SectionHeader
        badgeText="Start a Conversation"
        title="Project Inquiry Form"
        subtitle="Tell us your contact details and answer a short project brief so we can quote accurately."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <GSAPReveal direction="left" className="lg:col-span-7">
          <Suspense
            fallback={
              <div className="p-8 rounded-2xl border border-slate-300 dark:border-slate-800 text-sm text-slate-500">
                Loading form…
              </div>
            }
          >
            <ContactFormContent />
          </Suspense>
        </GSAPReveal>

        <GSAPReveal direction="right" className="lg:col-span-5 space-y-6">
          <GlowCard className="p-5">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Studio Identity</span>
              </div>
              <button
                onClick={() => setIsContactMuted(!isContactMuted)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                aria-label="Toggle Sound"
              >
                {isContactMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
              <video
                src="/video2.mp4"
                autoPlay
                loop
                muted={isContactMuted}
                playsInline
                className="w-full h-full object-contain sm:object-cover"
              />
            </div>
          </GlowCard>

          <GlowCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Direct Contact
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500">Email</div>
                  <a
                    href="mailto:kodraxelsoft@gmail.com"
                    className="font-bold text-slate-900 dark:text-slate-100"
                  >
                    kodraxelsoft@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500">Phone</div>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                    className="font-bold text-slate-900 dark:text-slate-100"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </GlowCard>
        </GSAPReveal>
      </div>

      <section className="pt-12">
        <SectionHeader
          badgeText="FAQ"
          title="Frequently Asked"
          gradientTitle="Questions"
        />
        <GSAPReveal stagger={0.06} className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden ${
                  isOpen
                    ? "border-[#004d4d]"
                    : "border-slate-300 dark:border-slate-800"
                } bg-white dark:bg-[#111726]`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </GSAPReveal>
      </section>
    </div>
  );
}
