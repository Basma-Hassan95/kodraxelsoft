"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlowCard } from "@/components/ui/GlowCard";
import { cmsFetch, apiDelete, isUuid } from "@/lib/cmsApi";
import type { JobApplication } from "@/types/admin";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import {
  APPLICATION_STATUSES,
  applicationStatusClass,
} from "@/lib/applicationStatus";

const STATUSES = APPLICATION_STATUSES;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">
        {children || <span className="text-slate-400 font-normal">—</span>}
      </div>
    </div>
  );
}

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [app, setApp] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await cmsFetch<JobApplication>(`/admin/applications/${id}`);
      setApp(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application");
      setApp(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (status: string) => {
    try {
      await cmsFetch(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApp((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      if (isUuid(id)) await apiDelete(`/admin/applications/${id}`);
      window.location.href = "/admin/applications";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-cyan-500 font-bold py-20 text-center">
        Loading applicant profile…
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/applications"
          className="text-xs font-semibold text-cyan-500 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to applications
        </Link>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          {error || "Application not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/applications"
            className="text-xs font-semibold text-cyan-500 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All applications
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {app.applicant_name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
            Applied for <strong className="text-slate-700 dark:text-slate-200">{app.career_title}</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={app.status}
            onChange={(e) => void updateStatus(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold uppercase tracking-wide ${applicationStatusClass(app.status)}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void remove()}
            className="px-3 py-2 rounded-xl border border-rose-500/40 text-rose-500 text-xs font-bold inline-flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-5 lg:col-span-2 space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
            <User className="w-4 h-4" /> Contact & location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name">{app.applicant_name}</Field>
            <Field label="Email">
              <a href={`mailto:${app.applicant_email}`} className="text-cyan-500 hover:underline inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {app.applicant_email}
              </a>
            </Field>
            <Field label="Phone / WhatsApp">
              {app.phone ? (
                <a href={`tel:${app.phone}`} className="inline-flex items-center gap-1 hover:text-cyan-500">
                  <Phone className="w-3.5 h-3.5" /> {app.phone}
                </a>
              ) : null}
            </Field>
            <Field label="Country">{app.country}</Field>
            <Field label="City">{app.city}</Field>
            <Field label="Address">
              {app.address ? (
                <span className="inline-flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {app.address}
                </span>
              ) : null}
            </Field>
          </div>
        </GlowCard>

        <GlowCard className="p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
            Application meta
          </h2>
          <Field label="Status">
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${applicationStatusClass(app.status)}`}
            >
              {app.status}
            </span>
          </Field>
          <Field label="Submitted">
            {app.created_at ? new Date(app.created_at).toLocaleString() : null}
          </Field>
          <Field label="Application ID">
            <span className="font-mono text-[11px] text-slate-500">{app.id}</span>
          </Field>
        </GlowCard>
      </div>

      <GlowCard className="p-5 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Professional profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Current role">{app.current_position}</Field>
          <Field label="Years of experience">{app.years_experience}</Field>
          <Field label="Current salary">{app.current_salary}</Field>
          <Field label="Expected salary">{app.expected_salary}</Field>
          <Field label="Notice period">{app.notice_period}</Field>
        </div>
      </GlowCard>

      <GlowCard className="p-5 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
          Links & resume
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Portfolio">
            {app.portfolio_url ? (
              <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Open portfolio
              </a>
            ) : null}
          </Field>
          <Field label="GitHub">
            {app.github_url ? (
              <a href={app.github_url} target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline inline-flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5" /> {app.github_url}
              </a>
            ) : null}
          </Field>
          <Field label="LinkedIn">
            {app.linkedin_url ? (
              <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline inline-flex items-center gap-1">
                <LinkedinIcon className="w-3.5 h-3.5" /> {app.linkedin_url}
              </a>
            ) : null}
          </Field>
          <Field label="CV / Resume">
            {app.cv_url ? (
              <a
                href={app.cv_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-500 text-xs font-bold"
              >
                <FileText className="w-4 h-4" />
                {app.cv_filename || "Download / view CV"}
              </a>
            ) : (
              <span className="text-slate-400">No CV uploaded</span>
            )}
          </Field>
        </div>
      </GlowCard>

      <GlowCard className="p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
          Cover letter
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {app.cover_note || "No cover letter provided."}
        </p>
      </GlowCard>
    </div>
  );
}
