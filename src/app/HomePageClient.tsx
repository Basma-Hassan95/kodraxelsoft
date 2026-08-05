"use client";

import React from "react";
import Link from "next/link";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Hero3DCanvas } from "@/components/ui/Hero3DCanvas";
import { HeroMessageCarousel } from "@/components/ui/HeroMessageCarousel";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { HomeAboutSection } from "@/components/ui/HomeAboutSection";
import { ServicesAccordion } from "@/components/ui/ServicesAccordion";
import { CaseStudiesStackedCarousel } from "@/components/ui/CaseStudiesStackedCarousel";
import { LiveProjectsShowcase } from "@/components/ui/LiveProjectsShowcase";
import { SocialCampaignsShowcase } from "@/components/ui/SocialCampaignsShowcase";
import { HomeTestimonials } from "@/components/ui/HomeTestimonials";
import { HomeContactForm } from "@/components/ui/HomeContactForm";
import { usePublicProjects } from "@/hooks/usePublicCms";
import { projectsData as fallbackProjects } from "@/data/projects";
import { pricingData as localPricing } from "@/data/pricing";
import { stripCurrencySymbol } from "@/lib/cmsMappers";
import type { HeroSlide } from "@/lib/heroCms";
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function HomePageClient({
  initialHeroSlides = [],
}: {
  initialHeroSlides?: HeroSlide[];
}) {
  const projectsData = usePublicProjects();
  const featuredFromCms = projectsData.filter((p) => p.featured);
  const homeCaseStudies =
    featuredFromCms.length > 0
      ? featuredFromCms
      : fallbackProjects.filter((p) => p.featured);
  const liveMarked = projectsData.filter((p) => p.liveProject);
  const homeLiveProjects =
    liveMarked.length > 0
      ? liveMarked
      : projectsData.filter((p) => Boolean(p.demoUrl) && !p.featured);

  const activePlans = localPricing.filter((p) => p.isActive);

  return (
    <div className="space-y-20 md:space-y-28 pb-20 overflow-x-hidden">
      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-14 overflow-hidden">
        <Hero3DCanvas />
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#004d4d]/20 rounded-full blur-[140px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <GSAPReveal direction="down" duration={0.35}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#006666]/40 bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-300 text-xs font-medium uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Custom Software for Growing Businesses</span>
            </div>
          </GSAPReveal>

          <HeroMessageCarousel initialSlides={initialHeroSlides} />

          <GSAPReveal direction="up" delay={0.15} duration={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="teal-gradient"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => {
                  document.getElementById("home-contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start a Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Code2 className="w-5 h-5" />}
                onClick={() => {
                  document.getElementById("home-services")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Our Services
              </Button>
            </div>
          </GSAPReveal>
        </div>
      </section>

      {/* 2. ABOUT */}
      <HomeAboutSection />

      {/* Marquee ribbons — below About */}
      <TechMarquee />

      {/* 3. SERVICES — accordion */}
      <section id="home-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Services"
          title="Transform Your Business with Our"
          gradientTitle="Expert Digital Services"
          subtitle="Hover or tap a card to expand — every service includes strategy, build, and launch support."
        />
        <ServicesAccordion />
      </section>

      {/* 4. PORTFOLIO — live projects + case studies */}
      <section id="home-portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <SectionHeader
            badgeText="Our Work"
            title="Real Projects We Have Built for"
            gradientTitle="Growing Businesses"
            subtitle="Take a look at how we turned complex business problems into simple, profit-generating software."
          />
          <LiveProjectsShowcase projects={homeLiveProjects} />
        </div>
        <div>
          <SectionHeader
            badgeText="Featured Project"
            title="High-Performance Trading &"
            gradientTitle="Business Portal"
            subtitle="We replaced a slow, confusing software system with a lightning-fast digital platform that processes customer actions instantly."
          />
          <CaseStudiesStackedCarousel projects={homeCaseStudies} />
        </div>
      </section>

      {/* Ads — hidden until admin publishes Meta ads */}
      <SocialCampaignsShowcase />

      {/* 5. PRICING */}
      <section id="home-pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Clear Pricing"
          title="Clear Plans for Every Stage of"
          gradientTitle="Growth"
          subtitle="No hidden fees. Pick the package that matches your current business goals."
        />
        <GSAPReveal
          stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {activePlans.map((plan) => {
            const hasDiscount =
              Boolean(plan.compareAtPrice) || plan.discountPercent > 0;
            return (
              <div key={plan.id} className="h-full min-w-0 flex">
                <GlowCard className="w-full h-full min-w-0 !flex !flex-col p-6">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white shrink-0">
                    {plan.title}
                  </h3>
                  <div className="mt-3 flex items-end gap-2 shrink-0">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.compareAtPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {stripCurrencySymbol(plan.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Tag className="w-3 h-3" />
                      {plan.discountPercent > 0
                        ? `Save ${plan.discountPercent}%`
                        : "Offer"}
                      {plan.discountLabel ? ` · ${plan.discountLabel}` : ""}
                    </div>
                  )}
                  <ul className="mt-4 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 shrink-0">
                    <Button
                      variant="teal-gradient"
                      size="sm"
                      className="w-full max-w-full min-w-0 justify-center box-border"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => {
                        const params = new URLSearchParams({
                          plan: plan.title,
                          price: stripCurrencySymbol(plan.price),
                          serviceName: `${plan.title} Pricing Plan`,
                        });
                        window.location.href = `/contact?${params.toString()}`;
                      }}
                    >
                      {plan.ctaText || "Get Started"}
                    </Button>
                  </div>
                </GlowCard>
              </div>
            );
          })}
        </GSAPReveal>
        <div className="mt-6 text-center">
          <Link
            href="/pricing"
            className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 hover:underline"
          >
            View all pricing details →
          </Link>
        </div>
      </section>

      {/* 6. REVIEWS */}
      <HomeTestimonials />

      {/* 7. CONTACT — form unchanged */}
      <section id="home-contact" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Contact Us"
          title="Tell Us What You Want to"
          gradientTitle="Build"
          subtitle="Share your idea, preferred platform, and color theme — we'll reply within 24 hours."
        />
        <HomeContactForm />
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
          NDA-ready conversations · No map needed — just your brief
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GSAPReveal direction="up" duration={0.4}>
          <div className="relative rounded-3xl border border-[#006666]/40 bg-[#0c1424] p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative z-10 max-w-xl space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Ready to Start?
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                Let&apos;s Build Your Next Successful Product
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stop fighting with confusing, outdated systems. Let us create digital tools that actually work for you.
              </p>
            </div>
            <Button
              variant="teal-gradient"
              size="lg"
              className="relative z-10 shrink-0"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                document.getElementById("home-contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start a Project
            </Button>
          </div>
        </GSAPReveal>
      </section>
    </div>
  );
}
