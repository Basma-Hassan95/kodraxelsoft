"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { jobRoles, JobRole } from "@/data/jobs";
import confetti from "canvas-confetti";
import { Briefcase, MapPin, DollarSign, CheckCircle2, ArrowRight, Send } from "lucide-react";

export default function CareersPage() {
  const [activeJobModal, setActiveJobModal] = useState<JobRole | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicantName && applicantEmail) {
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setSubmitted(false);
        setActiveJobModal(null);
        setApplicantName("");
        setApplicantEmail("");
        setPortfolioUrl("");
      }, 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Join Kodraxelsoft"
        title="Build the Next Generation of"
        gradientTitle="High-Scale Software"
        subtitle="Work directly alongside senior principal architects. We are scaling our engineering team with passionate senior engineers, AI researchers, and creative technologists."
      />

      {/* Staggered Perks Banner Grid */}
      <GSAPReveal stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">100% Remote Flexibility</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Work from anywhere with a $3,000 home office budget and flexible hours across US & European time zones.
          </p>
        </GlowCard>
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Architect Mentorship</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Direct 1-on-1 pairing with senior principal engineers on high-impact enterprise client systems.
          </p>
        </GlowCard>
        <GlowCard className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Competitive Equity & Perks</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Competitive top-tier base salaries, early team equity, full health benefits, and annual engineering retreats.
          </p>
        </GlowCard>
      </GSAPReveal>

      {/* Open Roles List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Current Open Positions ({jobRoles.length})</h2>

        <GSAPReveal stagger={0.1} className="space-y-6">
          {jobRoles.map((role) => (
            <GlowCard key={role.id} className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="px-2.5 py-1 rounded bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                    {role.department}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" /> {role.salaryRange}</span>
                  </div>
                </div>

                <Button
                  variant="teal-gradient"
                  size="md"
                  onClick={() => setActiveJobModal(role)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Role & Apply
                </Button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                {role.description}
              </p>
            </GlowCard>
          ))}
        </GSAPReveal>
      </div>

      {/* Application Modal */}
      {activeJobModal && (
        <Modal
          isOpen={!!activeJobModal}
          onClose={() => setActiveJobModal(null)}
          title={`Apply: ${activeJobModal.title}`}
        >
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Application Received!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Our engineering team will review your materials and reach out via email within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/janedoe"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setActiveJobModal(null)}>
                  Cancel
                </Button>
                <Button variant="teal-gradient" size="sm" icon={<Send className="w-4 h-4" />}>
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
}
