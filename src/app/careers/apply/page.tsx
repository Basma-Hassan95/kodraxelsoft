"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
  Send,
  Upload,
  User,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { usePublicCareers } from "@/hooks/usePublicCms";
import { jobRoles } from "@/data/jobs";

const emptyForm = {
  applicant_name: "",
  applicant_email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  current_position: "",
  years_experience: "",
  current_salary: "",
  expected_salary: "",
  notice_period: "",
  portfolio_url: "",
  github_url: "",
  linkedin_url: "",
  cover_note: "",
};

function ApplyFormInner() {
  const searchParams = useSearchParams();
  const cmsCareers = usePublicCareers();

  const careerIdParam = searchParams.get("career") || searchParams.get("id") || "";
  const titleParam = searchParams.get("title") || "";

  const roles = useMemo(() => {
    if (cmsCareers.length > 0) {
      return cmsCareers.map((c) => ({
        id: c.id,
        title: c.title,
        location: c.location,
        type: c.type,
        salary: c.salary,
        department: c.department,
      }));
    }
    return jobRoles.map((r) => ({
      id: r.id,
      title: r.title,
      location: r.location,
      type: r.type,
      salary: r.salaryRange,
      department: r.department,
    }));
  }, [cmsCareers]);

  const [careerId] = useState(careerIdParam);
  const [roleText, setRoleText] = useState(
    () => titleParam || ""
  );
  const [form, setForm] = useState(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const rolePrefillDone = React.useRef(Boolean(titleParam));

  const selectedRole =
    roles.find((r) => r.id === careerId) ||
    roles.find((r) => r.title === titleParam) ||
    null;

  React.useEffect(() => {
    if (rolePrefillDone.current || !selectedRole) return;
    setRoleText(selectedRole.department || selectedRole.title || "");
    rolePrefillDone.current = true;
  }, [selectedRole]);

  const careerRole = roleText.trim() || "Open Application";
  const careerTitle = roleText.trim() || selectedRole?.title || titleParam || "Open Application";

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { isUuid } = await import("@/lib/cmsApi");
      const { submitPublicApplication, uploadApplicationCv } = await import(
        "@/lib/publicContent"
      );

      let cv_url: string | undefined;
      let cv_filename: string | undefined;
      if (cvFile) {
        const uploaded = await uploadApplicationCv(cvFile);
        cv_url = uploaded.url;
        cv_filename = uploaded.filename;
      }

      await submitPublicApplication({
        career_id: isUuid(careerId) ? careerId : null,
        career_title: careerTitle,
        applicant_name: form.applicant_name.trim(),
        applicant_email: form.applicant_email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        country: form.country.trim() || undefined,
        current_position: form.current_position.trim() || undefined,
        years_experience: form.years_experience.trim() || undefined,
        current_salary: form.current_salary.trim() || undefined,
        expected_salary: form.expected_salary.trim() || undefined,
        notice_period: form.notice_period.trim() || undefined,
        portfolio_url: form.portfolio_url.trim() || undefined,
        github_url: form.github_url.trim() || undefined,
        linkedin_url: form.linkedin_url.trim() || undefined,
        cover_note: form.cover_note.trim() || undefined,
        cv_url,
        cv_filename,
      });

      setSubmitted(true);
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.55 } });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <GlowCard className="p-10 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Application submitted
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Thank you, <strong>{form.applicant_name}</strong>. Your application for{" "}
          <strong>{careerTitle}</strong> is with our hiring team. We typically respond
          within 48 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/careers">
            <Button variant="outline" size="sm">
              Back to Careers
            </Button>
          </Link>
          <Link href="/">
            <Button variant="teal-gradient" size="sm">
              Go Home
            </Button>
          </Link>
        </div>
      </GlowCard>
    );
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      <GlowCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 mb-1">
              Position applying for
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#004d4d] dark:text-cyan-400" />
              {careerRole}
            </h2>
            {selectedRole && (
              <p className="text-xs text-slate-500 mt-1">
                {selectedRole.title && selectedRole.department
                  ? `${selectedRole.title} · `
                  : ""}
                {selectedRole.location} · {selectedRole.type}
                {selectedRole.salary ? ` · ${selectedRole.salary}` : ""}
              </p>
            )}
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job role *
            </label>
            <input
              type="text"
              required
              list="apply-role-suggestions"
              placeholder="e.g. Frontend, Backend, Full-Stack…"
              value={roleText}
              onChange={(e) => setRoleText(e.target.value)}
              className={inputClass}
            />
            <datalist id="apply-role-suggestions">
              {Array.from(
                new Set(
                  roles
                    .map((r) => r.department || r.title)
                    .filter(Boolean) as string[]
                )
              ).map((label) => (
                <option key={label} value={label} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Personal */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Personal information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Full name *</label>
              <input
                required
                value={form.applicant_name}
                onChange={(e) => setField("applicant_name", e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email *</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.applicant_email}
                  onChange={(e) => setField("applicant_email", e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="jane@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Country</label>
              <input
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                className={inputClass}
                placeholder="Pakistan"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Address</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="Street, area, landmark"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className={inputClass}
                placeholder="Lahore"
              />
            </div>
          </div>
        </section>

        {/* Professional */}
        <section className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2 pt-4">
            <Briefcase className="w-4 h-4" /> Professional details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Current role / title</label>
              <input
                value={form.current_position}
                onChange={(e) => setField("current_position", e.target.value)}
                className={inputClass}
                placeholder="Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Years of experience</label>
              <input
                value={form.years_experience}
                onChange={(e) => setField("years_experience", e.target.value)}
                className={inputClass}
                placeholder="5+ years"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Current salary</label>
              <input
                value={form.current_salary}
                onChange={(e) => setField("current_salary", e.target.value)}
                className={inputClass}
                placeholder="PKR / USD — current package"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Expected salary</label>
              <input
                value={form.expected_salary}
                onChange={(e) => setField("expected_salary", e.target.value)}
                className={inputClass}
                placeholder="PKR / USD — open to discuss"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Notice period</label>
              <input
                value={form.notice_period}
                onChange={(e) => setField("notice_period", e.target.value)}
                className={inputClass}
                placeholder="Immediate / 2 weeks / 1 month"
              />
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2 pt-4">
            <Link2 className="w-4 h-4" /> Portfolio & profiles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Portfolio / website</label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={(e) => setField("portfolio_url", e.target.value)}
                className={inputClass}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">GitHub</label>
              <div className="relative">
                <GithubIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={form.github_url}
                  onChange={(e) => setField("github_url", e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">LinkedIn</label>
              <div className="relative">
                <LinkedinIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => setField("linkedin_url", e.target.value)}
                  className={`${inputClass} pl-9`}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CV + cover */}
        <section className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2 pt-4">
            <FileText className="w-4 h-4" /> Resume / CV & cover letter
          </h3>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Upload CV (PDF or Word, max 8MB)
            </label>
            <label className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <Upload className="w-5 h-5 text-cyan-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {cvFile ? cvFile.name : "Choose file…"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Recommended: PDF resume with projects & experience
                </div>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Cover letter</label>
            <textarea
              rows={5}
              value={form.cover_note}
              onChange={(e) => setField("cover_note", e.target.value)}
              className={inputClass}
              placeholder="Why do you want this role? Highlight relevant experience…"
            />
          </div>
        </section>

        {error && (
          <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
            {error}
            <div className="mt-1 font-normal text-rose-400/90">
              Tip: run SQL <code className="font-mono">007_job_applications_full.sql</code>{" "}
              in Supabase and keep backend on :5000.
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            href="/careers"
            className="text-xs font-semibold text-slate-500 hover:text-cyan-500 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to open roles
          </Link>
          <Button
            type="submit"
            variant="teal-gradient"
            size="md"
            disabled={submitting}
            icon={<Send className="w-4 h-4" />}
          >
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </GlowCard>
    </form>
  );
}

export default function CareersApplyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeader
        badgeText="Hiring"
        title="Job application"
        subtitle="Complete this form carefully. Your full profile — contact, experience, links, and CV — goes directly to our hiring desk."
      />
      <Suspense
        fallback={
          <div className="text-sm text-slate-500 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            Loading application form…
          </div>
        }
      >
        <ApplyFormInner />
      </Suspense>
    </div>
  );
}
