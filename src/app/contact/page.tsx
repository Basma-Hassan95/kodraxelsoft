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
  MapPin,
  CheckCircle2,
  Send,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams ? searchParams.get("type") || "web" : "web";
  const initialBudget = searchParams ? searchParams.get("budget") || "$15,000 - $30,000" : "$15,000 - $30,000";

  const [projectType, setProjectType] = useState<string>(initialType);
  const [selectedBudget, setSelectedBudget] = useState<string>(initialBudget);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
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
    { id: "mobile", name: "Cross-Platform Mobile" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(clientName && clientEmail)) return;

    const typeLabel =
      projectTypesList.find((t) => t.id === projectType)?.name || projectType;

    setSubmitting(true);
    setSubmitError("");

    try {
      const { submitPublicOrder } = await import("@/lib/publicContent");
      await submitPublicOrder({
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_company: clientCompany.trim() || undefined,
        project_type: typeLabel,
        budget: selectedBudget,
        details: projectDetails.trim() || undefined,
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
            Thank you, <strong className="text-slate-900 dark:text-white">{clientName}</strong>. Our engineering team has received your details for <strong className="text-[#004d4d] dark:text-cyan-400">{projectType}</strong>. We will contact you at <strong className="text-slate-900 dark:text-white">{clientEmail}</strong> within 24 hours.
          </p>
          <Button variant="teal-gradient" size="md" onClick={() => setFormSubmitted(false)}>
            Submit Another Project Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Project Type Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-3">
              1. Select Primary Architecture Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
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

          {/* 2. Budget Range Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-3">
              2. Estimated Budget Investment
            </label>
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
      q: "Who handles our project technical execution?",
      a: "You work 1-on-1 exclusively with our senior principal architects. We do not use account managers or offshore sub-contractors."
    },
    {
      q: "What is your standard project delivery timeline?",
      a: "Most Next.js Web App and AI integration projects take between 3 to 6 weeks from initial architecture blueprinting to production edge cutover."
    },
    {
      q: "Do you offer post-launch code warranties & SLAs?",
      a: "Yes. Every contract includes a 30-day full code warranty, 100/100 Lighthouse performance benchmark guarantee, and an optional continuous SLA maintenance retainer."
    },
    {
      q: "How do we get started after submitting this lead form?",
      a: "Within 24 hours, our technical discovery team will schedule a 30-minute technical discovery call with our engineering leads to review your requirements."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Start a Conversation"
        title="Direct Architectural Lead Form"
        subtitle="Ready to build? Fill out the project questionnaire below to connect directly with our principal architects within 24 hours."
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

            <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-inner">
              <video
                src="/video2.mp4"
                autoPlay
                loop
                muted={isContactMuted}
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-3 leading-relaxed">
              Engineered by principal software architects. 100% fixed-scope deliverable guarantee backed by NDA protection.
            </p>
          </GlowCard>

          <GlowCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Direct Contact Channels</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">General & Client Inquiries</div>
                  <a href={`mailto:${settings.contactEmail}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#004d4d] dark:hover:text-cyan-400">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Architect Direct Desk</div>
                  <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#004d4d] dark:hover:text-cyan-400">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Headquarters</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{settings.address}</div>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Location Map Teaser Card */}
          <GlowCard className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{settings.companyName} HQ Map</h3>
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&q=80&w=800"
                alt={`${settings.companyName} Map`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-[#006666]/50 text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span>{settings.companyName.toUpperCase()}</span>
                </div>
              </div>
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
