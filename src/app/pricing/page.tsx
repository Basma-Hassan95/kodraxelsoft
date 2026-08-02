"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { usePublicPricing } from "@/hooks/usePublicCms";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export default function PricingPage() {
  const plans = usePublicPricing();

  const faqs = [
    {
      q: "Are these fixed-price packages or estimates?",
      a: "Every plan is a fixed-scope quote based on the features listed. Custom requirements are always scoped separately before we begin.",
    },
    {
      q: "Can I switch plans mid-project?",
      a: "Yes — most clients start with Starter or Growth and upgrade as scope expands. We simply re-baseline the contract and timeline.",
    },
    {
      q: "Do discounts apply to ongoing retainers too?",
      a: "Discounted pricing applies to the initial build. Ongoing maintenance & SLA retainers are quoted separately after launch.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      <SectionHeader
        badgeText="Transparent Pricing"
        title="Plans Built for Every Stage of"
        gradientTitle="Product Growth"
        subtitle="Fixed-scope engagements with transparent pricing — no hidden retainers, no surprise change orders. Pick a plan or request a custom enterprise quote."
      />

      <GSAPReveal
        stagger={0.1}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
      >
        {plans
          .filter((p) => p.isActive)
          .map((plan) => {
            const hasDiscount =
              Boolean(plan.compareAtPrice) || plan.discountPercent > 0;
            return (
              <GlowCard
                key={plan.id}
                className={`h-full flex flex-col ${
                  plan.isFeatured
                    ? "border-[#004d4d] dark:border-cyan-500/60 ring-2 ring-[#004d4d]/20 dark:ring-cyan-500/20 scale-[1.02]"
                    : ""
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      plan.isFeatured
                        ? "bg-[#004d4d] text-white dark:bg-cyan-500 dark:text-slate-950"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-1 pr-8">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {plan.title}
                  </h3>
                  {plan.subtitle && (
                    <p className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wide">
                      {plan.subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-end gap-2 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.compareAtPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through decoration-2">
                        {plan.compareAtPrice}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      <Tag className="w-3 h-3" />
                      <span>
                        {plan.discountPercent > 0
                          ? `Save ${plan.discountPercent}%`
                          : "Discounted"}
                        {plan.discountLabel ? ` · ${plan.discountLabel}` : ""}
                      </span>
                    </div>
                  )}
                </div>

                {plan.description && (
                  <p className="mt-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {plan.description}
                  </p>
                )}

                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.isFeatured ? "teal-gradient" : "outline"}
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    const params = new URLSearchParams({
                      plan: plan.title,
                      price: plan.price,
                      serviceName: `${plan.title} Pricing Plan`,
                    });
                    if (plan.serviceSlug) params.set("service", plan.serviceSlug);
                    if (plan.compareAtPrice) {
                      params.set("compareAt", plan.compareAtPrice);
                    }
                    if (plan.discountPercent > 0) {
                      params.set("discount", String(plan.discountPercent));
                    }
                    window.location.href = `/contact?${params.toString()}`;
                  }}
                  className="w-full justify-center mt-8"
                >
                  {plan.ctaText || "Get Started"}
                </Button>
              </GlowCard>
            );
          })}
      </GSAPReveal>

      <GSAPReveal direction="up">
        <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Need something more custom?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Every engagement can be tailored — talk to our architects about a scoped, fixed-price quote.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => (window.location.href = "/contact?plan=custom")}
            className="shrink-0"
          >
            Request Custom Quote
          </Button>
        </div>
      </GSAPReveal>

      <section className="pt-4">
        <SectionHeader
          badgeText="Pricing FAQ"
          title="Common Questions About"
          gradientTitle="Our Plans"
        />
        <GSAPReveal
          stagger={0.08}
          className="max-w-3xl mx-auto grid grid-cols-1 gap-4"
        >
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-[#111726] shadow-sm flex gap-3"
            >
              <HelpCircle className="w-5 h-5 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </GSAPReveal>
      </section>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
        <span>All plans include NDA protection and a post-launch support window.</span>
      </div>
    </div>
  );
}
