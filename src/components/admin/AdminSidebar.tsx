"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Layers,
  Briefcase,
  PenTool,
  Inbox,
  Users,
  Star,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  ChevronRight,
  Eye,
  Megaphone,
  Tag,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { apiLogout, clearAdminToken } from "@/lib/cmsApi";
import { useAdminData } from "@/context/AdminDataContext";

export interface AdminMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Visitors", href: "/admin/visitors", icon: Eye, badge: "Live" },
  { name: "Meta Ads", href: "/admin/meta-ads", icon: Megaphone, badge: "Ads" },
  { name: "Media Library", href: "/admin/media", icon: Folder },
  { name: "Services", href: "/admin/services", icon: Layers },
  { name: "Pricing Plans", href: "/admin/pricing", icon: Tag },
  { name: "Projects", href: "/admin/portfolio", icon: Briefcase },
  { name: "Blog Posts", href: "/admin/blog", icon: PenTool },
  { name: "Leads CRM", href: "/admin/leads", icon: Inbox },
  { name: "Careers & Hiring", href: "/admin/careers", icon: Users },
  { name: "Applications", href: "/admin/applications", icon: Briefcase, badge: "Hire" },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "Data Backup", href: "/admin/backup", icon: Database },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { leads } = useAdminData();
  const newLeads = leads.filter((l) => l.status === "New").length;

  const handleLogout = () => {
    void (async () => {
      clearAdminToken();
      await apiLogout();
      window.location.href = "/admin/login";
    })();
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#070a12] text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none min-h-screen z-20 transition-colors duration-300">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group min-w-0">
            <Logo size="sm" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#004d4d]/10 dark:bg-cyan-500/20 text-[#004d4d] dark:text-cyan-400 border border-[#004d4d]/20 dark:border-cyan-500/30">
              CMS
            </span>
          </Link>
        </div>

        {/* Menu Links */}
        <div className="px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Admin Menu
          </div>

          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
            const badge =
              item.href === "/admin/leads" && newLeads > 0
                ? String(newLeads)
                : item.badge;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#004d4d] text-white shadow-lg border border-cyan-400/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-[#004d4d] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-cyan-300"
                        : "text-slate-400 group-hover:text-[#004d4d] dark:group-hover:text-cyan-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500 text-slate-950">
                    {badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform opacity-0 group-hover:opacity-100 ${
                      isActive ? "opacity-100 text-cyan-300" : ""
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-[#004d4d] dark:hover:text-cyan-300 transition-colors border border-slate-200 dark:border-slate-700/60"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
            <span>View Live Website</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">↗</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
