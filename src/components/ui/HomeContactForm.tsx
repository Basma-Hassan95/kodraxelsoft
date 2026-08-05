"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";

function HomeContactFields() {
  const searchParams = useSearchParams();
  const pricingPlan = searchParams?.get("plan") || "";
  const quotedPrice = searchParams?.get("price") || "";
  const serviceName = searchParams?.get("serviceName") || "";

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
        budget: quotedPrice || undefined,
        details,
        metadata: {
          source: pricingPlan
            ? "pricing_page"
            : serviceName
              ? "service_page"
              : "contact_page",
          service_name: serviceName || undefined,
          pricing_plan: pricingPlan || undefined,
          quoted_price: quotedPrice || undefined,
          design_source: brief.designReady,
          color_theme: labelOf(AESTHETIC_OPTIONS, brief.aesthetic),
          reference_website: brief.referenceWebsite.trim() || undefined,
          domain_hosting: brief.domainHosting,
          integrations: brief.integrations,
          timeline: brief.timeline,
          additional_specs: brief.additionalSpecs.trim() || undefined,
          design_ready_label: labelOf(DESIGN_OPTIONS, brief.designReady),
          domain_hosting_label: labelOf(DOMAIN_HOSTING_OPTIONS, brief.domainHosting),
          integrations_label: labelOf(INTEGRATION_OPTIONS, brief.integrations),
          timeline_label: labelOf(TIMELINE_OPTIONS, brief.timeline),
        },
      });
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Inquiry Received
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Thanks {name}. We&apos;ll reply to {email} within 24 hours.
        </p>
        <Button variant="teal-gradient" size="md" onClick={() => setSubmitted(false)}>
          Send Another
        </Button>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Full Name *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Email *</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">Phone / WhatsApp *</label>
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+92 300 0000000" />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          What kind of website / product do you want?
        </label>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="E.g. company website, e-commerce store, booking portal, SaaS dashboard…"
        />
      </div>

      <ContactProjectBrief value={brief} onChange={setBrief} />

      {error && (
        <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="teal-gradient"
        size="lg"
        disabled={submitting}
        icon={<Send className="w-4 h-4" />}
        className="w-full justify-center"
      >
        {submitting ? "Sending…" : "Submit Project Request"}
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
        We reply within 24 hours
      </div>
    </form>
  );
}

export const HomeContactForm: React.FC = () => {
  return (
    <GlowCard className="p-6 sm:p-8">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading form…</div>}>
        <HomeContactFields />
      </Suspense>
    </GlowCard>
  );
};
