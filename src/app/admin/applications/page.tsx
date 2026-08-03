"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { cmsList, cmsFetch, apiDelete, isUuid } from "@/lib/cmsApi";
import type { JobApplication } from "@/types/admin";
import {
  APPLICATION_STATUSES,
  applicationStatusClass,
} from "@/lib/applicationStatus";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";
import {
  Briefcase,
  RefreshCw,
  Mail,
  Phone,
  ExternalLink,
  Trash2,
  ArrowRight,
  FileText,
} from "lucide-react";

const STATUSES = APPLICATION_STATUSES;

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data } = await cmsList<JobApplication>("/admin/applications", {
        limit: 200,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setApplications(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applications. Run 006 + 007 migrations?"
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(true), 5000);
    return () => window.clearInterval(id);
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await cmsFetch(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      if (isUuid(id)) await apiDelete(`/admin/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Job Applications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Full hiring inbox — open any row for name, phone, address, CV, GitHub, LinkedIn, and more.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="px-4 py-2.5 rounded-xl bg-[#226263] text-white text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => {
          const active = filter === s;
          const tone =
            s === "all"
              ? active
                ? "bg-[#004d4d] text-white border-[#004d4d] dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-400"
                : "border-slate-300 dark:border-slate-700 text-slate-500"
              : active
                ? `${applicationStatusClass(s)} ring-2 ring-offset-1 ring-cyan-500/40 dark:ring-offset-slate-950`
                : `${applicationStatusClass(s)} opacity-70 hover:opacity-100`;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tone}`}
            >
              {s}
              {s !== "all" && (
                <span className="ml-1 opacity-70">
                  ({applications.filter((a) => a.status === s).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          {error}
        </div>
      )}

      <GlowCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Applicant</th>
                <th className="px-4 py-3 font-bold">Position</th>
                <th className="px-4 py-3 font-bold">Contact</th>
                <th className="px-4 py-3 font-bold">CV / Links</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Applied</th>
                <th className="px-4 py-3 font-bold" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    {loading ? "Loading…" : "No applications in this filter yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {app.applicant_name}
                      </div>
                      {app.current_position && (
                        <div className="text-[10px] text-slate-500">{app.current_position}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-cyan-500" />
                        {app.career_title}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-y-0.5">
                      <a
                        href={`mailto:${app.applicant_email}`}
                        className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        {app.applicant_email}
                      </a>
                      {app.phone && (
                        <a
                          href={`tel:${app.phone}`}
                          className="flex items-center gap-1 text-slate-500 hover:text-cyan-500"
                        >
                          <Phone className="w-3 h-3" />
                          {app.phone}
                        </a>
                      )}
                      {(app.city || app.country || app.address) && (
                        <div className="text-[10px] text-slate-400">
                          {[app.city, app.country].filter(Boolean).join(", ")}
                          {app.address ? ` · ${app.address}` : ""}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {app.cv_url && (
                          <a
                            href={app.cv_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-500 font-semibold"
                          >
                            <FileText className="w-3 h-3" /> CV
                          </a>
                        )}
                        {app.github_url && (
                          <a
                            href={app.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-cyan-400"
                          >
                            GitHub
                          </a>
                        )}
                        {app.linkedin_url && (
                          <a
                            href={app.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-cyan-400"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusSelect
                        value={app.status}
                        onChange={(status) => void updateStatus(app.id, status)}
                        statuses={STATUSES}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {app.created_at
                        ? new Date(app.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-500 text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          Full profile <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void remove(app.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>

      <p className="text-[11px] text-slate-400 flex items-center gap-1">
        <ExternalLink className="w-3 h-3" />
        Public apply form: <code className="font-mono">/careers/apply</code>
      </p>
    </div>
  );
}
