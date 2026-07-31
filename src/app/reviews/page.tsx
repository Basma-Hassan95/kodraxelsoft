"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Star, Send, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LeaveReviewPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || review.trim().length < 10) {
      setError("Name and a review of at least 10 characters are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { submitPublicReview } = await import("@/lib/publicContent");
      await submitPublicReview({
        client_name: name.trim(),
        company: company.trim() || undefined,
        position: role.trim() || undefined,
        review: review.trim(),
        rating,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeader
        badgeText="Client Feedback"
        title="Share Your Experience With"
        gradientTitle="Kodraxelsoft"
        subtitle="Reviews are moderated by our team before they appear on the homepage. Thank you for taking a moment to share feedback."
      />

      <GSAPReveal direction="up">
        <GlowCard className="p-8 sm:p-10">
          {done ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Review received
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your review is pending admin
                approval and will appear on the homepage once approved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/">
                  <Button variant="teal-gradient" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                    Back to Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDone(false);
                    setName("");
                    setCompany("");
                    setRole("");
                    setReview("");
                    setRating(5);
                  }}
                >
                  Submit another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full name *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / title
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="VP of Engineering"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your review *
                </label>
                <textarea
                  required
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about working with Kodraxelsoft…"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="p-1"
                      aria-label={`${i + 1} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-400 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  type="submit"
                  variant="teal-gradient"
                  size="md"
                  disabled={submitting}
                  icon={<Send className="w-4 h-4" />}
                  className="justify-center"
                >
                  {submitting ? "Submitting…" : "Submit Review"}
                </Button>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                  <span>Moderated before publishing on the homepage</span>
                </div>
              </div>
            </form>
          )}
        </GlowCard>
      </GSAPReveal>
    </div>
  );
}
