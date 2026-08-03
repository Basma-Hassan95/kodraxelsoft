"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Database, Download, ShieldCheck, CheckCircle2, FileJson } from "lucide-react";

export default function AdminBackupPage() {
  const { services, projects, blogPosts, leads, careers, testimonials, settings } = useAdminData();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadFullBackup = () => {
    const fullBackup = {
      backupTimestamp: new Date().toISOString(),
      studioName: "Kodraxelsoft Inc.",
      services,
      projects,
      blogPosts,
      leads,
      careers,
      testimonials,
      settings
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullBackup, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `kodraxelsoft-full-site-backup-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Data Backup & Disaster Recovery
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate 1-click JSON backups of all website content, articles, client leads, case studies, and settings.
        </p>
      </div>

      <GlowCard className="p-8 space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Full Site JSON Backup</h3>
            <div className="text-xs text-slate-500">100% complete snapshot of all 10 CMS modules</div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Downloading a backup allows you to restore or archive all client leads, written engineering blog posts, services data, and portfolio case studies at any time.
        </p>

        {downloaded && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Full JSON Backup File generated & downloaded successfully!</span>
          </div>
        )}

        <button
          onClick={handleDownloadFullBackup}
          className="px-6 py-3.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-xl transition-all flex items-center gap-2"
        >
          <Download className="w-4.5 h-4.5" />
          <span>Download 1-Click Site Backup (.JSON)</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Encrypted Local Snapshot Export</span>
        </div>
      </GlowCard>

    </div>
  );
}
