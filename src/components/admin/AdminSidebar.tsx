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
  X,
  LayoutTemplate,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { apiLogout, clearAdminToken } from "@/lib/cmsApi";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminNav } from "@/components/admin/AdminNavContext";

export interface AdminMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Hero Carousel", href: "/admin/hero", icon: LayoutTemplate },
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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
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
    <>
      <div className="space-y-6 flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sticky top-0 bg-white dark:bg-[#070a12] z-10">
          <Link
            href="/admin/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-2 group min-w-0"
          >
            <Logo size="sm" />
          </Link>
          {onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-3 space-y-1 pb-4">
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
                onClick={onNavigate}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#004d4d] text-white shadow-lg border border-cyan-400/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-[#004d4d] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-cyan-300"
                        : "text-slate-400 group-hover:text-[#004d4d] dark:group-hover:text-cyan-400"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500 text-slate-950 shrink-0">
                    {badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform opacity-0 group-hover:opacity-100 ${
                      isActive ? "opacity-100 text-cyan-300" : ""
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-[#070a12]">
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
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </>
  );
}

export const AdminSidebar: React.FC = () => {
  const { mobileOpen, closeMobile } = useAdminNav();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-[#070a12] text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex-col justify-between shrink-0 select-none min-h-screen sticky top-0 h-screen z-20 transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close menu overlay"
          onClick={closeMobile}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[min(100vw-3rem,18rem)] max-w-full bg-white dark:bg-[#070a12] text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onNavigate={closeMobile} />
        </aside>
      </div>
    </>
  );
};
