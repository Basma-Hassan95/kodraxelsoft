"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { cmsFetch, apiDelete, isUuid } from "@/lib/cmsApi";
import { leadFromOrder, leadStatusToApi } from "@/lib/cmsMappers";
import type { LeadInquiry } from "@/types/admin";
import {
  ArrowLeft,
  Briefcase,
  Building,
  ClipboardList,
  Mail,
  Phone,
  Tag,
  Trash2,
  User,
  Wallet,
  Clock,
  ExternalLink,
  Globe,
  MessageSquareText,
} from "lucide-react";

const STATUSES: LeadInquiry["status"][] = [
  "New",
  "In Progress",
  "Closed Won",
  "Archived",
];

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

function statusClass(status: LeadInquiry["status"]) {
  if (status === "New")
    return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  if (status === "Closed Won")
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (status === "Archived")
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  return "bg-amber-500/20 text-amber-400 border-amber-500/30";
}

function sourceSummary(lead: LeadInquiry): string | null {
  const m = lead.metadata;
  if (!m) return null;
  if (m.service_name && m.source === "service_page") {
    return `Client selected service: ${m.service_name}`;
  }
  if (m.pricing_plan && m.source === "pricing_page") {
    const price = m.quoted_price || lead.selectedBudget;
    return price
      ? `Client selected pricing plan: ${m.pricing_plan} · Quoted ${price}`
      : `Client selected pricing plan: ${m.pricing_plan}`;
  }
  if (m.service_name) return `Service: ${m.service_name}`;
  if (m.pricing_plan) return `Pricing: ${m.pricing_plan}`;
  if (m.source === "service_page") return "Came via Services page";
  if (m.source === "pricing_page") return "Came via Pricing page";
  if (m.source === "contact_page") return "Came via Contact / homepage form";
  return null;
}

function hasProjectBrief(m: LeadInquiry["metadata"]) {
  if (!m) return false;
  return Boolean(
    m.design_ready_label ||
      m.domain_hosting_label ||
      m.integrations_label ||
      m.color_theme ||
      m.timeline_label ||
      m.additional_specs ||
      m.reference_website ||
      m.design_source
  );
}

/** Remove duplicated numbered brief dump from details when metadata already has it */
function extractProductGoal(details: string, briefPresent: boolean): string {
  const raw = (details || "").trim();
  if (!raw) return "";
  if (!briefPresent) return raw;

  const cut = raw.search(/\n\s*1\.\s*Design ready:/i);
  if (cut >= 0) return raw.slice(0, cut).trim();

  const lines = raw.split("\n").filter((line) => {
    const t = line.trim();
    if (/^\d+\.\s/.test(t)) return false;
    if (/^Reference website:/i.test(t)) return false;
    if (/^Additional specs:/i.test(t)) return false;
    if (/^UI\/UX:/i.test(t)) return false;
    if (/^Color theme:/i.test(t)) return false;
    return true;
  });
  return lines.join("\n").trim();
}

function BriefRow({
  step,
  question,
  answer,
}: {
  step: number | string;
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090d16]">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#004d4d] text-white text-[11px] font-extrabold flex items-center justify-center">
        {step}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {question}
        </p>
        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words">
          {answer || <span className="text-slate-400 font-normal">Not answered</span>}
        </div>
      </div>
    </div>
  );
}

export default function AdminLeadDetailPage() {
  const { confirm, alert } = useAdminUi();
  const params = useParams();
  const id = String(params?.id || "");
  const [lead, setLead] = useState<LeadInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await cmsFetch<Record<string, unknown>>(
        `/admin/orders/${id}`
      );
      setLead(leadFromOrder(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead");
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (status: LeadInquiry["status"]) => {
    try {
      await cmsFetch(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: leadStatusToApi(status) }),
      });
      setLead((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      await alert({
        message: err instanceof Error ? err.message : "Status update failed",
        tone: "danger",
      });
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Delete lead?",
      message: "Delete this lead permanently? This cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      if (isUuid(id)) await apiDelete(`/admin/orders/${id}`);
      window.location.href = "/admin/leads";
    } catch (err) {
      await alert({
        message: err instanceof Error ? err.message : "Delete failed",
        tone: "danger",
      });
    }
  };

  const m = lead?.metadata;
  const briefOk = hasProjectBrief(m);
  const productGoal = useMemo(
    () => (lead ? extractProductGoal(lead.projectDetails, briefOk) : ""),
    [lead, briefOk]
  );

  if (loading) {
    return (
      <div className="text-sm text-cyan-500 font-bold py-20 text-center">
        Loading client project brief…
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/leads"
          className="text-xs font-semibold text-cyan-500 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to leads
        </Link>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          {error || "Lead not found"}
        </div>
      </div>
    );
  }

  const source = sourceSummary(lead);
  const serviceSlug = lead.metadata?.service_slug;
  const serviceHref = serviceSlug ? `/services/${serviceSlug}` : "/services";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-cyan-500 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All leads
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {lead.clientName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <Briefcase className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>
              Project:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {lead.projectType || "General inquiry"}
              </strong>
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={lead.status}
            onChange={(e) =>
              void updateStatus(e.target.value as LeadInquiry["status"])
            }
            className={`px-3 py-2 rounded-xl border text-xs font-bold ${statusClass(lead.status)}`}
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

      {source && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
          <Tag className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-xs font-semibold space-y-1">
            <p>{source}</p>
            {lead.metadata?.service_name && (
              <Link
                href={serviceHref}
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-bold underline underline-offset-2"
              >
                Open public service page <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 1. Contact */}
      <GlowCard className="p-5 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <User className="w-4 h-4" /> Client contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">{lead.clientName}</Field>
          <Field label="Email">
            <a
              href={`mailto:${lead.clientEmail}`}
              className="text-cyan-500 hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> {lead.clientEmail}
            </a>
          </Field>
          <Field label="Phone / WhatsApp">
            {lead.clientPhone ? (
              <a
                href={`tel:${lead.clientPhone.replace(/\s/g, "")}`}
                className="text-cyan-500 hover:underline inline-flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> {lead.clientPhone}
              </a>
            ) : (
              "Not provided"
            )}
          </Field>
          <Field label="Company">
            <span className="inline-flex items-center gap-1">
              <Building className="w-3.5 h-3.5 shrink-0" />
              {lead.clientCompany || "Not provided"}
            </span>
          </Field>
          <Field label="Budget / quote">
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <Wallet className="w-3.5 h-3.5" />
              {lead.metadata?.quoted_price ||
                lead.selectedBudget ||
                "Not specified"}
            </span>
          </Field>
          <Field label="Submitted">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lead.createdAt}
            </span>
          </Field>
        </div>
      </GlowCard>

      {/* 2. What they want */}
      <GlowCard className="p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <MessageSquareText className="w-4 h-4" /> What they want to build
        </h2>
        <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {productGoal || "No product description provided."}
        </p>
        {(lead.metadata?.service_name || lead.metadata?.pricing_plan) && (
          <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lead.metadata?.service_name && (
              <Field label="Service">{lead.metadata.service_name}</Field>
            )}
            {lead.metadata?.pricing_plan && (
              <Field label="Pricing plan">{lead.metadata.pricing_plan}</Field>
            )}
          </div>
        )}
      </GlowCard>

      {/* 3. Clear project brief */}
      {briefOk ? (
        <GlowCard className="p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Project brief (form answers)
          </h2>
          <div className="space-y-2.5">
            <BriefRow
              step={1}
              question="Do you have a design ready?"
              answer={m?.design_ready_label || m?.design_source}
            />
            <BriefRow
              step={2}
              question="Domain & hosting setup?"
              answer={m?.domain_hosting_label || m?.domain_hosting}
            />
            <BriefRow
              step={3}
              question="Custom database or APIs?"
              answer={m?.integrations_label || m?.integrations}
            />
            <BriefRow
              step={4}
              question="Preferred aesthetic / theme?"
              answer={m?.color_theme}
            />
            <BriefRow
              step={5}
              question="Target launch timeline?"
              answer={m?.timeline_label || m?.timeline}
            />
            <BriefRow
              step={6}
              question="Additional specifications?"
              answer={
                m?.additional_specs ? (
                  <span className="font-medium whitespace-pre-wrap">
                    {m.additional_specs}
                  </span>
                ) : (
                  "None"
                )
              }
            />
            {m?.reference_website && (
              <BriefRow
                step="R"
                question="Reference website"
                answer={
                  <a
                    href={m.reference_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-500 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    {m.reference_website}
                  </a>
                }
              />
            )}
          </div>
        </GlowCard>
      ) : null}

      <p className="text-[10px] text-slate-400 font-mono">
        Lead ID: {lead.id} · Status: {lead.status} · Source:{" "}
        {lead.metadata?.source?.replace(/_/g, " ") || "contact page"}
      </p>
    </div>
  );
}
