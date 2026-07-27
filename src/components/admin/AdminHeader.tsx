"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, User, ShieldCheck, Sun, Moon, Check, Inbox, Folder, Layers, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAdminData } from "@/context/AdminDataContext";

export const AdminHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { leads } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const newLeadsCount = leads.filter((l) => l.status === "New").length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#090d16] border-b border-slate-300/80 dark:border-slate-800/80 px-6 flex items-center justify-between z-30 shrink-0 select-none relative">
      
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search CMS modules, posts, or leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Production Mode Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production Live System</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon & Popover Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors focus:outline-none"
            aria-label="Admin Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          {/* Interactive Notifications Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#004d4d] dark:text-cyan-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications ({unreadCount})
                  </span>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-cyan-500 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                
                {/* Notification 1: New Lead Brief */}
                <Link
                  href="/admin/leads"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800/80 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-left flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                      New Client Brief ({newLeadsCount} Pending)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Jonathan Hayes submitted a $50K-$100K+ Next.js Web App inquiry.
                    </div>
                    <div className="text-[10px] text-cyan-400 font-semibold pt-1">Just now • Click to view in CRM</div>
                  </div>
                </Link>

                {/* Notification 2: Media Asset Registered */}
                <Link
                  href="/admin/media"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800/80 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-left flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                      AI Brand Videos Registered
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      `video1.mp4` and `video2.mp4` linked in Media Asset Library.
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">10 mins ago</div>
                  </div>
                </Link>

                {/* Notification 3: System SLA */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-left flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      System SLA Guarantee Active
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      All 10 Admin CMS modules operating with 99.99% uptime.
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">1 hour ago</div>
                  </div>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                <Link
                  href="/admin/leads"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 hover:underline flex items-center justify-center gap-1"
                >
                  <span>Review Lead Management CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          )}
        </div>

        {/* Admin Profile Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-[#004d4d] text-white font-bold text-xs flex items-center justify-center border border-cyan-400/40 shadow-sm">
            KS
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Principal Admin
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              System Architect
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
