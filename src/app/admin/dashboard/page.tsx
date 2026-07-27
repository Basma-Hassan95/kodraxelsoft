"use client";

import React from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Chart3DCylindrical } from "@/components/ui/Chart3DCylindrical";
import { useAdminData } from "@/context/AdminDataContext";
import {
  TrendingUp,
  Users,
  Inbox,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const { leads, projects, services, blogPosts } = useAdminData();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const wonLeads = leads.filter((l) => l.status === "Closed Won").length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
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
            Monitor real-time visitor analytics, client lead pipelines, and control 100% of website content dynamically without code changes.
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <Link href="/admin/leads">
            <button className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              <span>Review Leads ({newLeads} New)</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 3D Tilt KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Monthly Visitors */}
        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly Visitors
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter target={24580} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 pt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </GlowCard>

        {/* KPI 2: Total Client Leads */}
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
            <span>{newLeads} Action Required</span>
          </div>
        </GlowCard>

        {/* KPI 3: Projects Portfolio */}
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
            <AnimatedCounter target={projects.length} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pt-2">
            <span>{services.length} Core Pillars Active</span>
          </div>
        </GlowCard>

        {/* KPI 4: Converted Revenue Volume */}
        <GlowCard className="p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pipeline Won Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#004d4d] dark:text-cyan-400">
            $<AnimatedCounter target={480} suffix="K+" />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 pt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{wonLeads} Enterprise Deals Won</span>
          </div>
        </GlowCard>

      </div>

      {/* 3D Cylindrical Bar Chart & System Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3D Isometric Cylindrical Bar Chart (8 Cols) */}
        <GlowCard className="lg:col-span-8 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                3D Weekly Traffic & Visitor Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                3D Isometric Cylindrical Pillars tracking unique visitors & engagement over 7 days.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
              3D Real-Time Stream
            </span>
          </div>

          {/* 3D Isometric Cylindrical Bar Chart */}
          <Chart3DCylindrical />
        </GlowCard>

        {/* CMS System Health & Quick Module Jump (4 Cols) */}
        <GlowCard className="lg:col-span-4 p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            CMS System Controls
          </h3>

          <div className="space-y-3">
            <Link href="/admin/services" className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span>Edit Services ({services.length} Pillars)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link href="/admin/portfolio" className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span>Manage Portfolio ({projects.length} Projects)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link href="/admin/blog" className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span>Publish Blog Posts ({blogPosts.length} Articles)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link href="/admin/media" className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#004d4d] hover:text-white transition-colors border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span>Media Library Asset Manager</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Dynamic CMS Engine Active</span>
          </div>
        </GlowCard>

      </div>

      {/* Recent Client Inquiries Stream */}
      <GlowCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Client Project Briefs (CRM Stream)
          </h3>
          <Link href="/admin/leads" className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 hover:underline flex items-center gap-1">
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

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
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{lead.clientName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{lead.clientCompany}</td>
                  <td className="py-3 font-semibold text-[#004d4d] dark:text-cyan-400">{lead.projectType}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">{lead.selectedBudget}</td>
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
                  <td className="py-3 text-slate-500 text-[11px]">{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>

    </div>
  );
}
