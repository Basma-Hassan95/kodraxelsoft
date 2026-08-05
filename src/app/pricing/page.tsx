"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
<<<<<<< Updated upstream
import { usePublicPricing } from "@/hooks/usePublicCms";
=======
import { pricingData } from "@/data/pricing";
import { stripCurrencySymbol } from "@/lib/cmsMappers";
>>>>>>> Stashed changes
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export default function PricingPage() {
  const plans = pricingData.filter((p) => p.isActive);

  const faqs = [
    {
      q: "Are these fixed prices or just estimates?",
      a: "Every package is a fixed-price quote based on the features listed. We confirm your requirements before starting so you know the total cost upfront.",
    },
    {
      q: "Can I upgrade my package later?",
      a: "Yes. Many clients start with a Landing Page or Business Site and later move to WordPress or Shopify as their business grows. We update the plan without disrupting live work.",
    },
    {
      q: "What happens after I select a package?",
      a: "You are taken to the contact form with your selected package and price filled in. Our team replies within 24 hours to confirm scope and kick off the project.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      <SectionHeader
        badgeText="Clear Pricing"
        title="Clear Plans for Every Stage of"
        gradientTitle="Growth"
        subtitle="Pick a plan — the exact price carries into your contact inquiry. Fixed-scope projects with clear pricing—no hidden retainers, no surprise change fees. Choose a plan below or request a custom business quote."
      />

      <GSAPReveal
        stagger={0.1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
      >
<<<<<<< Updated upstream
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
=======
        {plans.map((plan) => {
          const hasDiscount =
            Boolean(plan.compareAtPrice) || plan.discountPercent > 0;
          return (
            <GlowCard
              key={plan.id}
              className="h-full flex flex-col"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {plan.title}
                </h3>
                {plan.subtitle && (
                  <p className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wide">
                    {plan.subtitle}
>>>>>>> Stashed changes
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
                      {stripCurrencySymbol(plan.compareAtPrice)}
                    </span>
                  )}
                </div>

<<<<<<< Updated upstream
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
=======
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
                variant="teal-gradient"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  const params = new URLSearchParams({
                    plan: plan.title,
                    price: stripCurrencySymbol(plan.price),
                    serviceName: `${plan.title} Pricing Plan`,
                  });
                  if (plan.serviceSlug) params.set("service", plan.serviceSlug);
                  if (plan.compareAtPrice) {
                    params.set(
                      "compareAt",
                      stripCurrencySymbol(plan.compareAtPrice)
                    );
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
>>>>>>> Stashed changes
      </GSAPReveal>

      <GSAPReveal direction="up">
        <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Need Something Custom for Your Business?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Every project can be tailored to your specific needs. Talk to our experts for a clear, fixed-price quote.
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
            Request Custom Quote →
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
        <span>
          All plans include strict privacy contracts (NDA) and a dedicated post-launch warranty window.
        </span>
      </div>
    </div>
  );
}
