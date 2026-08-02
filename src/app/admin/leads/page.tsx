"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { LeadInquiry } from "@/context/AdminDataContext";
import {
  Inbox,
  Trash2,
  Download,
  Mail,
  Building,
  Briefcase,
  ChevronRight,
} from "lucide-react";

function leadSourceLabel(lead: LeadInquiry): string | null {
  const m = lead.metadata;
  if (!m) return null;
  if (m.service_name && m.source === "service_page") {
    return `Came via service: ${m.service_name}`;
  }
  if (m.pricing_plan && m.source === "pricing_page") {
    return `Came via pricing: ${m.pricing_plan}`;
  }
  if (m.service_name) return `Service: ${m.service_name}`;
  if (m.pricing_plan) return `Pricing: ${m.pricing_plan}`;
  if (m.source === "service_page") return "Came via Services page";
  if (m.source === "pricing_page") return "Came via Pricing page";
  return null;
}

export default function AdminLeadsPage() {
  const { leads, updateLeadStatus, deleteLead, refreshLeads, apiConnected, loading } =
    useAdminData();
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [refreshing, setRefreshing] = useState(false);

  const filteredLeads = filterStatus === "All"
    ? leads
    : leads.filter((l) => l.status === filterStatus);

  const handleExportCSV = () => {
    const headers = "ID,Client Name,Client Email,Company,Architecture Type,Budget Range,Status,Timestamp,Service,Pricing Plan\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.clientName}","${l.clientEmail}","${l.clientCompany}","${l.projectType}","${l.selectedBudget}","${l.status}","${l.createdAt}","${l.metadata?.service_name || ""}","${l.metadata?.pricing_plan || ""}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kodraxelsoft-leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshLeads();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Client Inquiries & Leads CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any lead to open the full project brief and selected service details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={refreshing || loading}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Leads (CSV)</span>
          </button>
        </div>
      </div>

      {!apiConnected && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          CMS API offline or admin not logged in — leads will not sync from the database.
          Start backend (`cd backend && npm run dev`) and login again.
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["All", "New", "In Progress", "Closed Won", "Archived"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === status
                ? "bg-[#004d4d] text-white border border-cyan-400/40 shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:text-white"
            }`}
          >
            {status} ({status === "All" ? leads.length : leads.filter((l) => l.status === status).length})
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {!loading && filteredLeads.length === 0 && (
          <GlowCard className="p-10 text-center space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-400" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">No leads yet</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Submit the public contact form at `/contact`. New inquiries save to Supabase
              `orders` and show up here + in the bell notifications.
            </p>
          </GlowCard>
        )}

        {filteredLeads.map((lead) => (
          <GlowCard key={lead.id} className="p-6 space-y-4 hover:border-[#004d4d]/40 dark:hover:border-cyan-500/40 transition-colors">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <Link href={`/admin/leads/${lead.id}`} className="space-y-1 flex-1 min-w-0 group">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#004d4d] dark:group-hover:text-cyan-400 transition-colors">
                    {lead.clientName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold">
                    {lead.projectType}
                  </span>
                  {leadSourceLabel(lead) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      <Briefcase className="w-3 h-3" />
                      {leadSourceLabel(lead)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">
                      {lead.clientEmail}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                    <span>{lead.clientCompany || "Enterprise Client"}</span>
                  </span>
                  <span>• Budget: <strong className="text-emerald-500">{lead.selectedBudget}</strong></span>
                </div>
              </Link>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={lead.status}
                  onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadInquiry["status"])}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Archived">Archived</option>
                </select>

                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="p-2 rounded-xl bg-[#004d4d]/10 hover:bg-[#004d4d] text-[#004d4d] hover:text-white dark:text-cyan-400 dark:hover:text-white border border-[#004d4d]/30 transition-colors"
                  aria-label="Open lead details"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => deleteLead(lead.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                  aria-label="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Link href={`/admin/leads/${lead.id}`} className="block">
              <div className="bg-slate-50 dark:bg-[#090d16] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed hover:border-[#004d4d]/30 transition-colors">
                <div className="font-bold text-slate-900 dark:text-slate-200 mb-1">Project Objectives & Scope Brief:</div>
                <p className="line-clamp-2">{lead.projectDetails || "Client requested technical discovery call for architecture roadmap."}</p>
              </div>
            </Link>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="text-[#004d4d] dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                Open full details <ChevronRight className="w-3 h-3" />
              </Link>
              <span>Submitted: {lead.createdAt}</span>
            </div>

          </GlowCard>
        ))}
      </div>

    </div>
  );
}
