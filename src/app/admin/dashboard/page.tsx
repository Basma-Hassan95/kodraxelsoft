"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  Chart3DCylindrical,
  type Chart3DDataItem,
} from "@/components/ui/Chart3DCylindrical";
import { useAdminData } from "@/context/AdminDataContext";
import { cmsFetch, loadVisitorsOverview, type VisitorsOverview } from "@/lib/cmsApi";
import {
  TrendingUp,
  Users,
  Inbox,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Eye,
  Star,
  Megaphone,
} from "lucide-react";

type DashboardStats = {
  totalServices: number;
  totalProjects: number;
  totalReviews: number;
  totalOrders: number;
  totalContactMessages: number;
  unreadMessages: number;
  pendingOrders: number;
  pendingReviews: number;
  totalMetaAds: number;
  totalMedia: number;
  totalBlogPosts: number;
  totalPageViews: number;
  todayViews: number;
  pendingApplications?: number;
  totalApplications?: number;
  completedOrders?: number;
};

const DAY_STYLES = [
  {
    colorName: "Coral Red",
    bgGradient: "from-rose-500 via-rose-600 to-rose-700",
    topCapColor: "#f87171",
  },
  {
    colorName: "Amber Gold",
    bgGradient: "from-amber-400 via-amber-500 to-amber-600",
    topCapColor: "#fbbf24",
  },
  {
    colorName: "Emerald Green",
    bgGradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    topCapColor: "#34d399",
  },
  {
    colorName: "Cyan Blue",
    bgGradient: "from-sky-400 via-sky-500 to-sky-600",
    topCapColor: "#38bdf8",
  },
  {
    colorName: "Purple Violet",
    bgGradient: "from-purple-500 via-purple-600 to-purple-700",
    topCapColor: "#c084fc",
  },
  {
    colorName: "Teal Cyan",
    bgGradient: "from-teal-400 via-teal-500 to-teal-600",
    topCapColor: "#2dd4bf",
  },
  {
    colorName: "Indigo Glow",
    bgGradient: "from-indigo-500 via-indigo-600 to-indigo-700",
    topCapColor: "#818cf8",
  },
];

function weekdayLabel(isoDate: string) {
  try {
    return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString(undefined, {
      weekday: "short",
      timeZone: "UTC",
    });
  } catch {
    return isoDate.slice(5);
  }
}

function buildWeeklyChart(
  daily: VisitorsOverview["daily"] | undefined
): Chart3DDataItem[] {
  const last7 = (daily || []).slice(-7);
  // Ensure 7 slots even if API returned fewer
  while (last7.length < 7) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - last7.length));
    last7.push({
      stat_date: d.toISOString().slice(0, 10),
      total_views: 0,
      unique_visitors: 0,
    });
  }

  const max = Math.max(
    1,
    ...last7.map((d) => Math.max(d.unique_visitors || 0, d.total_views || 0))
  );

  return last7.map((d, i) => {
    const visitors = d.unique_visitors || 0;
    const views = d.total_views || 0;
    const metric = Math.max(visitors, views);
    const style = DAY_STYLES[i % DAY_STYLES.length];
    return {
      label: weekdayLabel(d.stat_date),
      value: Math.round((metric / max) * 100),
      actualVal: String(visitors || views),
      ...style,
    };
  });
}

export default function AdminDashboardPage() {
  const { leads, projects, services, blogPosts, loading, apiConnected, refreshAll } =
    useAdminData();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitors, setVisitors] = useState<VisitorsOverview | null>(null);
  const [dashLoading, setDashLoading] = useState(true);

  const loadDashboard = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setDashLoading(true);
    try {
      const [overview, visitorsData] = await Promise.all([
        cmsFetch<{ stats: DashboardStats }>("/admin/dashboard")
          .then((r) => r.data)
          .catch(() => null),
        loadVisitorsOverview(),
      ]);
      if (overview?.stats) setStats(overview.stats);
      setVisitors(visitorsData);
    } finally {
      if (!opts?.silent) setDashLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
    const id = window.setInterval(() => void loadDashboard({ silent: true }), 5000);
    const onFocus = () => void loadDashboard({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadDashboard]);

  const totalLeads = stats?.totalOrders ?? leads.length;
  const newLeads =
    stats?.pendingOrders ?? leads.filter((l) => l.status === "New").length;
  const wonLeads =
    stats?.completedOrders ??
    leads.filter((l) => l.status === "Closed Won").length;

  const todayVisitors = visitors?.summary.today.uniqueVisitors ?? 0;
  const weekVisitors = visitors?.summary.last7Days.uniqueVisitors ?? 0;
  const totalViews =
    stats?.totalPageViews ?? visitors?.summary.totalViews ?? 0;

  const chartData = useMemo(
    () => buildWeeklyChart(visitors?.daily),
    [visitors?.daily]
  );

  const recentLeads = leads.slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/90 dark:bg-[#111726]/90 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Executive Studio Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to Kodraxelsoft Control Center
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Live numbers from Supabase — visitors, leads, content, and hiring
            applications.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${
                apiConnected
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-400/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiConnected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {loading || dashLoading
                ? "Syncing CMS..."
                : apiConnected
                  ? `Live data · ${visitors?.source === "api" ? "API" : "local"} analytics`
                  : "Offline — limited fallback"}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            onClick={() => {
              void refreshAll();
              void loadDashboard();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-200 font-bold text-xs flex items-center gap-2 hover:border-cyan-400/40"
          >
            <RefreshCw
              className={`w-4 h-4 ${dashLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <Link href="/admin/leads">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Inbox className="w-4 h-4" />
              <span>Review Leads ({newLeads} New)</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/visitors">
          <GlowCard className="p-6 hover:border-cyan-400/40 transition-colors cursor-pointer h-full">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Visitors (Today)
              </span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter target={todayVisitors} />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 pt-2">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {weekVisitors} unique · 7d · {totalViews} total views
              </span>
            </div>
          </GlowCard>
        </Link>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Inbox className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter target={totalLeads} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{newLeads} pending action</span>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Published Case Studies
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter
              target={stats?.totalProjects ?? projects.length}
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pt-2">
            <span>
              {stats?.totalServices ?? services.length} services ·{" "}
              {stats?.totalBlogPosts ?? blogPosts.length} posts
            </span>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deals Closed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#004d4d] dark:text-cyan-400">
            <AnimatedCounter target={wonLeads} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 pt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {stats?.pendingApplications ?? 0} new job apps ·{" "}
              {stats?.pendingReviews ?? 0} reviews pending
            </span>
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GlowCard className="lg:col-span-8 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                3D Weekly Traffic & Visitor Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real unique visitors from Supabase `page_views` / daily stats
                (last 7 days).
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
              {weekVisitors} unique · 7d
            </span>
          </div>

          <Chart3DCylindrical data={chartData} />
        </GlowCard>

        <GlowCard className="lg:col-span-4 p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            CMS Snapshot
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Star className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {stats?.totalReviews ?? 0}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Reviews
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Megaphone className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {stats?.totalMetaAds ?? 0}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Meta Ads
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Eye className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {stats?.totalMedia ?? 0}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Media
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Users className="w-4 h-4 mx-auto text-violet-400 mb-1" />
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {stats?.totalApplications ?? 0}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Applications
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/visitors"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <span>Website Visitors Analytics</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/careers"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <span>
                Hiring Inbox ({stats?.pendingApplications ?? 0} new)
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/testimonials"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <span>
                Reviews to approve ({stats?.pendingReviews ?? 0})
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Synced from live Supabase CMS</span>
          </div>
        </GlowCard>
      </div>

      <GlowCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Client Project Briefs (CRM Stream)
          </h3>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No leads yet. Submissions from `/contact` will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Client Name</th>
                  <th className="pb-3 font-bold">Company</th>
                  <th className="pb-3 font-bold">Architecture Type</th>
                  <th className="pb-3 font-bold">Budget Range</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {lead.clientName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {lead.clientCompany}
                    </td>
                    <td className="py-3 font-semibold text-[#004d4d] dark:text-cyan-400">
                      {lead.projectType}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {lead.selectedBudget}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          lead.status === "New"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : lead.status === "Closed Won"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {lead.createdAt}
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
