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
  ChevronRight
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export interface AdminMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Media Library", href: "/admin/media", icon: Folder },
  { name: "Services", href: "/admin/services", icon: Layers },
  { name: "Case Studies", href: "/admin/portfolio", icon: Briefcase },
  { name: "Blog Posts", href: "/admin/blog", icon: PenTool },
  { name: "Leads CRM", href: "/admin/leads", icon: Inbox, badge: "New" },
  { name: "Careers & Hiring", href: "/admin/careers", icon: Users },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "Data Backup", href: "/admin/backup", icon: Database },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem("kodraxelsoft_admin_auth");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-slate-900 dark:bg-[#070a12] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none min-h-screen z-20">
      
      {/* Top Section */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <Logo size="sm" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              CMS
            </span>
          </Link>
        </div>

        {/* WordPress-Style Menu Links */}
        <div className="px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Admin Menu
          </div>

          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#004d4d] text-white shadow-lg border border-cyan-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500 text-slate-950">
                    {item.badge}
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

      {/* Bottom Section: Live Site Link & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:text-cyan-300 transition-colors border border-slate-700/60"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Live Website</span>
          </span>
          <span className="text-[10px] text-slate-500">↗</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>

    </aside>
  );
};
