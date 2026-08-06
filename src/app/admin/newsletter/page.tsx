"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { cmsList, apiDelete, isUuid } from "@/lib/cmsApi";
import type { NewsletterSubscriber } from "@/types/admin";
import {
  Mail,
  Trash2,
  RefreshCw,
  Download,
  Users,
} from "lucide-react";

type ApiRow = {
  id: string;
  email: string;
  source?: string;
  is_active?: boolean;
  created_at?: string;
};

function mapRow(row: ApiRow): NewsletterSubscriber {
  return {
    id: String(row.id),
    email: String(row.email || ""),
    source: String(row.source || "footer"),
    isActive: row.is_active !== false,
    createdAt: String(row.created_at || "").slice(0, 19).replace("T", " "),
  };
}

export default function AdminNewsletterPage() {
  const { confirm, alert } = useAdminUi();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data } = await cmsList<ApiRow>("/admin/newsletter", {
        limit: 500,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setSubscribers((data || []).map(mapRow));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscribers. Run migration 012?"
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Remove subscriber?",
      message: "Delete this email from the newsletter list?",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      if (isUuid(id)) await apiDelete(`/admin/newsletter/${id}`);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      await alert({
        message: err instanceof Error ? err.message : "Delete failed",
        tone: "danger",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = "Email,Source,Active,Subscribed At\n";
    const rows = subscribers
      .map((s) =>
        [
          `"${s.email.replace(/"/g, '""')}"`,
          s.source,
          s.isActive ? "yes" : "no",
          s.createdAt,
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-7 h-7 text-cyan-500" />
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Emails collected from the footer Engineering Brief form — stored in Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#226263] text-white hover:bg-[#1a4f50] disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Total subscribers
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {subscribers.length}
              </div>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Active
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {subscribers.filter((s) => s.isActive).length}
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-semibold">
          {error}
        </div>
      )}

      <GlowCard className="overflow-hidden p-0">
        {loading ? (
          <div className="p-10 text-center text-sm text-cyan-500 font-bold">
            Loading subscribers…
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No subscribers yet
            </p>
            <p>When someone uses the footer Subscribe form, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0a0f1a] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {subscribers.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{s.source}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                          s.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/30"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {s.createdAt || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDelete(s.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                        aria-label="Delete subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlowCard>
    </div>
  );
}
