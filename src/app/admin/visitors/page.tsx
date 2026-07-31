"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  loadVisitorsOverview,
  type VisitorsOverview,
} from "@/lib/cmsApi";
import {
  Users,
  Eye,
  TrendingUp,
  RefreshCw,
  MonitorSmartphone,
  Globe2,
  Clock,
  Sparkles,
  BarChart3,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function DeviceIcon({ type }: { type?: string }) {
  if (type === "mobile") return <Smartphone className="w-3.5 h-3.5" />;
  if (type === "tablet") return <Tablet className="w-3.5 h-3.5" />;
  return <Laptop className="w-3.5 h-3.5" />;
}

export default function AdminVisitorsPage() {
  const [data, setData] = useState<VisitorsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("All");

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const overview = await loadVisitorsOverview();
      setData(overview);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh({ silent: true }), 5000);
    const onFocus = () => void refresh({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const summary = data?.summary;
  const maxDaily = Math.max(
    1,
    ...(data?.daily.map((d) => d.total_views) || [1])
  );

  const filteredVisits =
    data?.recentVisits.filter((v) => {
      const matchDevice =
        deviceFilter === "All" || v.device_type === deviceFilter.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        v.page_path.toLowerCase().includes(q) ||
        (v.page_title || "").toLowerCase().includes(q) ||
        (v.browser || "").toLowerCase().includes(q) ||
        (v.referrer || "").toLowerCase().includes(q);
      return matchDevice && matchSearch;
    }) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audience Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Website Visitors
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live audience for Kodraxelsoft — total views, unique visitors, top pages, and recent traffic.
            Only visible inside Admin CMS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${
              data?.source === "api"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-500 border-amber-500/30"
            }`}
          >
            {data?.source === "api" ? "Live API Sync" : "Local Tracker Mode"}
          </span>
          <button
            onClick={() => void refresh()}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Views
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading && !summary ? "—" : <AnimatedCounter target={summary?.today.views || 0} />}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-2">
            <Users className="w-3.5 h-3.5" />
            <span>{summary?.today.uniqueVisitors || 0} unique today</span>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Last 7 Days
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading && !summary ? "—" : <AnimatedCounter target={summary?.last7Days.views || 0} />}
          </div>
          <div className="text-xs font-semibold text-emerald-500 pt-2">
            {summary?.last7Days.uniqueVisitors || 0} unique visitors
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              This Month
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading && !summary ? "—" : <AnimatedCounter target={summary?.thisMonth.views || 0} />}
          </div>
          <div className="text-xs font-semibold text-slate-500 pt-2">
            {summary?.thisMonth.uniqueVisitors || 0} unique this month
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              All-Time Views
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Globe2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading && !summary ? "—" : <AnimatedCounter target={summary?.totalViews || 0} />}
          </div>
          <div className="text-xs font-semibold text-amber-500 pt-2">
            ~{summary?.totalUniqueVisitorsApprox || 0} unique sessions
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily chart */}
        <GlowCard className="lg:col-span-8 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                14-Day Traffic Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily page views from your live website audience.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
              Auto-refresh 5s
            </span>
          </div>

          <div className="flex items-end gap-2 h-48">
            {(data?.daily || []).map((day) => {
              const height = Math.max(6, Math.round((day.total_views / maxDaily) * 100));
              return (
                <div key={day.stat_date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.total_views}
                  </div>
                  <div className="w-full flex items-end justify-center h-36">
                    <div
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#004d4d] to-cyan-400 shadow-lg shadow-cyan-500/20 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${day.stat_date}: ${day.total_views} views / ${day.unique_visitors} unique`}
                    />
                  </div>
                  <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                    {day.stat_date.slice(5)}
                  </div>
                </div>
              );
            })}
            {!data?.daily?.length && (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                {loading ? "Loading chart..." : "No visitor data yet — browse the live site to start tracking."}
              </div>
            )}
          </div>
        </GlowCard>

        {/* Top pages */}
        <GlowCard className="lg:col-span-4 p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            Top Pages
          </h3>
          <div className="space-y-3">
            {(data?.topPages || []).length === 0 && (
              <p className="text-xs text-slate-500">No page hits recorded yet.</p>
            )}
            {(data?.topPages || []).map((page, idx) => (
              <div
                key={page.page_path}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-cyan-400 w-4">{idx + 1}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {page.page_path}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 shrink-0">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Recent visits table */}
      <GlowCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Visitor Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest page opens across the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Desktop", "Mobile", "Tablet"].map((d) => (
              <button
                key={d}
                onClick={() => setDeviceFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  deviceFilter === d
                    ? "bg-[#004d4d] text-white border border-cyan-400/40"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800"
                }`}
              >
                {d}
              </button>
            ))}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search path, browser..."
              className="px-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 min-w-[180px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-bold">Page</th>
                <th className="pb-3 font-bold">Device</th>
                <th className="pb-3 font-bold">Browser</th>
                <th className="pb-3 font-bold">Referrer</th>
                <th className="pb-3 font-bold">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredVisits.map((visit) => (
                <tr
                  key={visit.id}
                  className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="py-3">
                    <div className="font-bold text-slate-900 dark:text-white">{visit.page_path}</div>
                    {visit.page_title && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[220px]">
                        {visit.page_title}
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold capitalize">
                      <DeviceIcon type={visit.device_type} />
                      {visit.device_type || "desktop"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {visit.browser || "—"}
                    {visit.os ? (
                      <span className="text-slate-500 font-medium"> · {visit.os}</span>
                    ) : null}
                  </td>
                  <td className="py-3 text-slate-500 max-w-[180px] truncate">
                    {visit.referrer || "Direct"}
                  </td>
                  <td className="py-3 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {formatTime(visit.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filteredVisits.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <MonitorSmartphone className="w-8 h-8 text-cyan-400/60" />
                      <span className="font-semibold">No visitors matched this filter yet.</span>
                      <span className="text-[11px]">
                        Open the live website in another tab — visits will appear here automatically.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
