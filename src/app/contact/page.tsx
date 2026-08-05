"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
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
  Briefcase
} from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

const SERVICE_SLUG_TO_TYPE: Record<string, string> = {
  "web-architecture": "web",
  "ai-integration": "ai",
  "cloud-infrastructure": "cloud",
  "mobile-enterprise": "mobile",
  "ai-automation": "ai-automation",
  wordpress: "wordpress",
  "custom-software": "saas"
};

function ContactFormContent() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams ? searchParams.get("service") || "" : "";
  const serviceName = searchParams ? searchParams.get("serviceName") || "" : "";
  const pricingPlan = searchParams ? searchParams.get("plan") || "" : "";
  const quotedPrice = searchParams ? searchParams.get("price") || "" : "";
  const compareAtPrice = searchParams ? searchParams.get("compareAt") || "" : "";
  const discountPercent = searchParams ? searchParams.get("discount") || "" : "";
  const initialType = searchParams
    ? searchParams.get("type") || SERVICE_SLUG_TO_TYPE[serviceSlug] || "web"
    : "web";
  const hasExactQuote = Boolean(quotedPrice.trim());
  const initialBudget = searchParams
    ? searchParams.get("budget") ||
      (hasExactQuote ? quotedPrice.trim() : "$15,000 - $30,000")
    : "$15,000 - $30,000";

  const [projectType, setProjectType] = useState<string>(initialType);
  const [selectedBudget, setSelectedBudget] = useState<string>(initialBudget);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [projectDetails, setProjectDetails] = useState(() => {
    if (pricingPlan && quotedPrice) {
      return `I'm interested in the ${pricingPlan} plan at the quoted price of ${quotedPrice}. `;
    }
    if (serviceName) {
      return `I'm interested in: ${serviceName}${pricingPlan ? ` (${pricingPlan} plan)` : ""}. `;
    }
    return "";
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const budgetOptions = [
    "$15,000 - $30,000",
    "$30,000 - $50,000",
    "$50,000 - $100,000+",
    "Custom / Enterprise Scope"
  ];

  const projectTypesList = [
    { id: "web", name: "Next.js Web App" },
    { id: "ai", name: "AI Model & Multi-Agent" },
    { id: "cloud", name: "Cloud Infrastructure" },
    { id: "mobile", name: "Cross-Platform Mobile" },
    { id: "ai-automation", name: "AI Automation" },
    { id: "wordpress", name: "WordPress Development" },
    { id: "saas", name: "Custom Software / SaaS" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(clientName && clientEmail)) return;

    const typeLabel =
      projectTypesList.find((t) => t.id === projectType)?.name || projectType;

    // Always send exact plan price when client came from a pricing plan
    const budgetToSave = hasExactQuote ? quotedPrice.trim() : selectedBudget;

    setSubmitting(true);
    setSubmitError("");

    try {
      const { submitPublicOrder } = await import("@/lib/publicContent");
      await submitPublicOrder({
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_company: clientCompany.trim() || undefined,
        project_type: typeLabel,
        budget: budgetToSave,
        details: projectDetails.trim() || undefined,
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
        },
      });

      setFormSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save your inquiry. Please ensure the CMS API is running and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlowCard className="p-8 sm:p-10">
      {formSubmitted ? (
        <div className="text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Project Brief Received!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-900 dark:text-white">{clientName}</strong>. Our engineering team has received your details
            {hasExactQuote ? (
              <>
                {" "}for the quoted price of{" "}
                <strong className="text-[#004d4d] dark:text-cyan-400">{quotedPrice}</strong>
                {pricingPlan ? (
                  <>
                    {" "}({pricingPlan})
                  </>
                ) : null}
              </>
            ) : (
              <>
                {" "}for <strong className="text-[#004d4d] dark:text-cyan-400">{projectType}</strong>
              </>
            )}
            . We will contact you at <strong className="text-slate-900 dark:text-white">{clientEmail}</strong> within 24 hours.
          </p>
          <Button variant="teal-gradient" size="md" onClick={() => setFormSubmitted(false)}>
            Submit Another Project Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {(serviceName || pricingPlan || hasExactQuote) && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#004d4d]/10 border border-[#004d4d]/30 text-[#004d4d] dark:text-cyan-400">
              <Briefcase className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs font-semibold leading-relaxed space-y-1">
                {serviceName ? (
                  <p>
                    You came through:{" "}
                    <span className="font-extrabold">{serviceName}</span>
                    {serviceSlug === "wordpress" ||
                    /wordpress/i.test(serviceName) ? (
                      <span className="font-bold"> (WordPress service inquiry)</span>
                    ) : null}
                  </p>
                ) : null}
                {pricingPlan ? (
                  <p>
                    Pricing plan selected:{" "}
                    <span className="font-extrabold">{pricingPlan}</span>
                  </p>
                ) : null}
                {hasExactQuote ? (
                  <p>
                    Agreed quote:{" "}
                    <span className="font-extrabold text-lg">{quotedPrice}</span>
                    {compareAtPrice ? (
                      <span className="ml-2 line-through opacity-60">{compareAtPrice}</span>
                    ) : null}
                    {discountPercent ? (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                        ({discountPercent}% off)
                      </span>
                    ) : null}
                  </p>
                ) : null}
                <p className="text-[11px] opacity-80 font-medium">
                  Our team will see this exact quote on your inquiry.
                </p>
              </div>
            </div>
          )}

          {/* 1. Project Type Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-3">
              1. Select Primary Architecture Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {projectTypesList.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setProjectType(type.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    projectType === type.id
                      ? "border-[#004d4d] bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400"
                      : "border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Exact quoted price OR budget ranges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-3">
              2. {hasExactQuote ? "Quoted Plan Price" : "Estimated Budget Investment"}
            </label>
            {hasExactQuote ? (
              <div className="p-4 rounded-xl border-2 border-[#004d4d] bg-[#004d4d]/10 dark:border-cyan-500/50 dark:bg-cyan-500/10">
                <div className="flex flex-wrap items-end gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#004d4d] dark:text-cyan-300">
                    {quotedPrice}
                  </span>
                  {compareAtPrice ? (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {compareAtPrice}
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  This exact price from your selected plan will be saved with your inquiry
                  {pricingPlan ? ` (${pricingPlan})` : ""}. Budget ranges are not used for pricing-page quotes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {budgetOptions.map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => setSelectedBudget(budget)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      selectedBudget === budget
                        ? "border-[#004d4d] bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400"
                        : "border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Client Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization Name</label>
            <input
              type="text"
              placeholder="Acme Enterprise Inc."
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Scope & Objectives</label>
            <textarea
              rows={4}
              placeholder="Describe your product vision, target launch date, or specific technical requirements..."
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          {submitError && (
            <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {submitError}
              <div className="mt-1 font-normal text-rose-400/90">
                Tip: Backend API must be running at{" "}
                <code className="font-mono">http://localhost:5000</code> (
                <code className="font-mono">cd backend && npm run dev</code>).
              </div>
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
            {submitting ? "Sending to CMS..." : "Submit Project Brief"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
            <span>Strict NDA Protection & 24-Hour Technical Response SLA</span>
          </div>
        </form>
      )}
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
      q: "Who will actually build and handle our software project?",
      a: "You partner directly with our senior software experts. No junior developers, no middle managers, and no lost details along the way.",
    },
    {
      q: "How long does a standard software project take to launch?",
      a: "Most standard projects launch within 4 to 8 weeks, depending on complexity. We set a fixed timeline before we start so you can plan your launch with confidence.",
    },
    {
      q: "Do you offer post-launch support and performance guarantees?",
      a: "Yes! Every project includes a 30-day warranty after launch. We monitor system health, fix any minor issues, and keep your software running smoothly 24/7.",
    },
    {
      q: "What happens immediately after I submit this inquiry form?",
      a: "Within 24 hours, our senior team reviews your project brief and emails you to schedule a free 15-minute strategy call to discuss your goals and budget.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Start a Conversation"
        title="Tell Us About Your"
        gradientTitle="Project Idea"
        subtitle="Share a few details about your business goals. Our team will review your request and get back to you with a clear roadmap within 24 hours."
      />

      {/* Main Grid: Form + Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Col */}
        <GSAPReveal direction="left" className="lg:col-span-7">
          <Suspense fallback={<div className="p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] text-slate-600 dark:text-slate-400 text-sm">Loading questionnaire...</div>}>
            <ContactFormContent />
          </Suspense>
        </GSAPReveal>

        {/* Contact Info & Video 2 Col */}
        <GSAPReveal direction="right" className="lg:col-span-5 space-y-6">
          
          {/* 3D Glassmorphic Studio Trust Video Card (Video 2) */}
          <GlowCard className="p-5">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Kodraxelsoft Studio Identity</span>
              </div>
              <button
                onClick={() => setIsContactMuted(!isContactMuted)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors"
                aria-label="Toggle Sound"
              >
                {isContactMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>

            <div className="relative w-full aspect-video sm:h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
              <video
                src="/video2.mp4"
                autoPlay
                loop
                muted={isContactMuted}
                playsInline
                className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
              />
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-3 leading-relaxed">
              Engineered by principal software architects. 100% fixed-scope deliverable guarantee backed by NDA protection.
            </p>
          </GlowCard>

          <GlowCard className="p-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#004d4d] dark:text-cyan-400 mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              Studio Identity
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Direct Contact Details
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Have a quick question or prefer reaching out directly? Connect with our team straight away.
            </p>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Email Us</div>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#004d4d] dark:hover:text-cyan-400"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Call Us</div>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                    className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#004d4d] dark:hover:text-cyan-400"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                Availability: Monday to Friday | Fast response guaranteed
              </p>
            </div>
          </GlowCard>
        </GSAPReveal>

      </div>

      {/* FAQ Accordion Section */}
      <section className="pt-12">
        <SectionHeader
          badgeText="FAQ"
          title="Frequently Asked"
          gradientTitle="Questions"
          subtitle="Everything you need to know about partnering with our elite software studio."
        />

        <GSAPReveal stagger={0.08} className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                  isOpen
                    ? "border-[#004d4d] bg-white dark:bg-[#111726] ring-1 ring-[#004d4d]/30"
                    : "border-slate-300 dark:border-slate-800/80 bg-white dark:bg-[#111726] hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white hover:text-[#004d4d] dark:hover:text-cyan-400 focus:outline-none transition-colors"
                >
                  <span className="text-slate-900 dark:text-slate-50 font-bold">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#004d4d] dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-3 bg-slate-50/50 dark:bg-[#090d16]/40">
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
