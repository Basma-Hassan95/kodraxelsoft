"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlowCard } from "@/components/ui/GlowCard";
import { cmsFetch, apiDelete, isUuid } from "@/lib/cmsApi";
import { leadFromOrder, leadStatusToApi } from "@/lib/cmsMappers";
import type { LeadInquiry } from "@/types/admin";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Mail,
  Tag,
  Trash2,
  User,
  Wallet,
  Clock,
  ExternalLink,
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
    return `Client selected pricing plan: ${m.pricing_plan}`;
  }
  if (m.service_name) return `Service: ${m.service_name}`;
  if (m.pricing_plan) return `Pricing: ${m.pricing_plan}`;
  if (m.source === "service_page") return "Came via Services page";
  if (m.source === "pricing_page") return "Came via Pricing page";
  return null;
}

export default function AdminLeadDetailPage() {
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
      alert(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      if (isUuid(id)) await apiDelete(`/admin/orders/${id}`);
      window.location.href = "/admin/leads";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

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
              Project type:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {lead.projectType || "Not specified"}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-5 lg:col-span-2 space-y-5">
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
            <Field label="Company">
              <span className="inline-flex items-center gap-1">
                <Building className="w-3.5 h-3.5 shrink-0" />
                {lead.clientCompany || "Not provided"}
              </span>
            </Field>
            <Field label="Budget">
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <Wallet className="w-3.5 h-3.5" />
                {lead.selectedBudget || "Not specified"}
              </span>
            </Field>
          </div>
        </GlowCard>

        <GlowCard className="p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
            Inquiry meta
          </h2>
          <Field label="Status">
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusClass(lead.status)}`}
            >
              {lead.status}
            </span>
          </Field>
          <Field label="Submitted">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lead.createdAt}
            </span>
          </Field>
          <Field label="Lead ID">
            <span className="font-mono text-[11px] text-slate-500">{lead.id}</span>
          </Field>
          <Field label="Source channel">
            {lead.metadata?.source?.replace(/_/g, " ") || "contact page"}
          </Field>
        </GlowCard>
      </div>

      <GlowCard className="p-5 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Selected service / plan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Architecture / project type">{lead.projectType}</Field>
          <Field label="Service name">
            {lead.metadata?.service_name || "—"}
          </Field>
          <Field label="Service slug">
            {lead.metadata?.service_slug ? (
              <Link
                href={`/services/${lead.metadata.service_slug}`}
                target="_blank"
                className="text-cyan-500 hover:underline font-mono text-xs"
              >
                {lead.metadata.service_slug}
              </Link>
            ) : (
              "—"
            )}
          </Field>
          <Field label="Pricing plan">
            {lead.metadata?.pricing_plan || "—"}
          </Field>
        </div>
      </GlowCard>

      <GlowCard className="p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
          Project objectives & scope brief
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {lead.projectDetails ||
            "Client requested a technical discovery call for architecture roadmap."}
        </p>
      </GlowCard>
    </div>
  );
}
