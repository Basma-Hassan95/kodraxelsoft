"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  User,
  ShieldCheck,
  Check,
  Inbox,
  MessageSquare,
  Star,
  Briefcase,
  ArrowRight,
  X,
  Trash2,
  Users,
  Layers,
  PenTool,
  Folder,
  LayoutDashboard,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { cmsFetch } from "@/lib/cmsApi";
import {
  clearAllAdminNotifications,
  dismissAdminNotification,
  loadAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  mergeAdminNotifications,
  unreadAdminNotificationCount,
  type StoredAdminNotif,
} from "@/lib/adminNotifications";
import { searchAdminCms } from "@/lib/adminSearch";

type InboxPayload = {
  counts: {
    unreadMessages: number;
    pendingReviews: number;
    pendingOrders: number;
    pendingApplications?: number;
    todayVisitors: number;
    todayViews: number;
  };
  unreadMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    created_at: string;
  }>;
  pendingReviews: Array<{
    id: string;
    client_name: string;
    company?: string;
    review: string;
    created_at: string;
  }>;
  pendingOrders: Array<{
    id: string;
    client_name: string;
    client_email: string;
    project_type?: string;
    budget?: string;
    created_at: string;
  }>;
  pendingApplications?: Array<{
    id: string;
    career_title: string;
    applicant_name: string;
    applicant_email: string;
    phone?: string;
    created_at: string;
  }>;
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

const VISITOR_BASELINE_KEY = "kodraxelsoft_admin_visitor_baseline";

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const {
    leads,
    services,
    projects,
    blogPosts,
    careers,
    testimonials,
    mediaAssets,
    apiConnected,
    refreshLeads,
  } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<StoredAdminNotif[]>([]);
  const [adminName, setAdminName] = useState("Admin");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(
    () =>
      searchAdminCms({
        query: searchQuery,
        services,
        projects,
        blogPosts,
        leads,
        careers,
        testimonials,
        mediaAssets,
      }),
    [
      searchQuery,
      services,
      projects,
      blogPosts,
      leads,
      careers,
      testimonials,
      mediaAssets,
    ]
  );

  useEffect(() => {
    const stored =
      sessionStorage.getItem("kodraxelsoft_admin_name") ||
      localStorage.getItem("kodraxelsoft_admin_name");
    if (stored?.trim()) setAdminName(stored.trim());

    void (async () => {
      try {
        const { apiMe } = await import("@/lib/cmsApi");
        const me = await apiMe();
        const name = me?.name?.trim();
        if (name) {
          setAdminName(name);
          sessionStorage.setItem("kodraxelsoft_admin_name", name);
          localStorage.setItem("kodraxelsoft_admin_name", name);
        }
      } catch {
        /* keep stored / default */
      }
    })();
  }, []);

  const syncFromInbox = useCallback(async () => {
    const incoming: Array<Omit<StoredAdminNotif, "read">> = [];

    try {
      const { data: inbox } = await cmsFetch<InboxPayload>("/admin/dashboard/inbox");

      for (const order of inbox?.pendingOrders || []) {
        incoming.push({
          id: `lead-${order.id}`,
          href: `/admin/leads/${order.id}`,
          title: `New lead: ${order.client_name}`,
          body: `${order.project_type || "Project"} · ${order.budget || "Budget TBD"} · ${order.client_email}`,
          createdAt: order.created_at || new Date().toISOString(),
          kind: "lead",
        });
      }

      for (const msg of inbox?.unreadMessages || []) {
        incoming.push({
          id: `msg-${msg.id}`,
          href: "/admin/leads",
          title: `Message from ${msg.name}`,
          body: msg.subject || msg.message.slice(0, 90),
          createdAt: msg.created_at || new Date().toISOString(),
          kind: "message",
        });
      }

      for (const rev of inbox?.pendingReviews || []) {
        incoming.push({
          id: `rev-${rev.id}`,
          href: "/admin/testimonials",
          title: `Review pending: ${rev.client_name}`,
          body: rev.review.slice(0, 90),
          createdAt: rev.created_at || new Date().toISOString(),
          kind: "review",
        });
      }

      for (const app of inbox?.pendingApplications || []) {
        incoming.push({
          id: `app-${app.id}`,
          href: `/admin/applications/${app.id}`,
          title: `Job application: ${app.applicant_name}`,
          body: `${app.career_title} · ${app.applicant_email}${app.phone ? ` · ${app.phone}` : ""}`,
          createdAt: app.created_at || new Date().toISOString(),
          kind: "application",
        });
      }

      const todayVisitors = inbox?.counts?.todayVisitors ?? 0;
      const todayViews = inbox?.counts?.todayViews ?? 0;
      const baselineRaw = localStorage.getItem(VISITOR_BASELINE_KEY);
      const baseline = baselineRaw ? Number(baselineRaw) : todayVisitors;
      if (!baselineRaw) {
        localStorage.setItem(VISITOR_BASELINE_KEY, String(todayVisitors));
      } else if (todayVisitors > baseline) {
        const gained = todayVisitors - baseline;
        incoming.push({
          id: `visitor-${new Date().toISOString().slice(0, 13)}-${todayVisitors}`,
          href: "/admin/visitors",
          title: gained === 1 ? "New website visitor" : `${gained} new website visitors`,
          body: `Today: ${todayVisitors} unique · ${todayViews} page views`,
          createdAt: new Date().toISOString(),
          kind: "visitor",
        });
        localStorage.setItem(VISITOR_BASELINE_KEY, String(todayVisitors));
      } else if (todayVisitors < baseline) {
        // New calendar day reset
        localStorage.setItem(VISITOR_BASELINE_KEY, String(todayVisitors));
      }
    } catch {
      /* offline — still show stored history */
    }

    // Fallback from local leads CRM if inbox empty
    for (const l of leads.filter((x) => x.status === "New").slice(0, 20)) {
      incoming.push({
        id: `lead-${l.id}`,
        href: `/admin/leads/${l.id}`,
        title: `New lead: ${l.clientName}`,
        body: `${l.projectType || "Project"} · ${l.selectedBudget || "Budget TBD"} · ${l.clientEmail}`,
        createdAt: l.createdAt || new Date().toISOString(),
        kind: "lead",
      });
    }

    const merged = mergeAdminNotifications(incoming);
    setNotifications(merged);
  }, [leads]);

  useEffect(() => {
    setNotifications(loadAdminNotifications());
    void syncFromInbox();
    const id = window.setInterval(() => {
      void syncFromInbox();
      void refreshLeads();
    }, 5000);
    const onFocus = () => {
      void syncFromInbox();
      void refreshLeads();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [syncFromInbox, refreshLeads]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSearchResult = (href: string) => {
    setSearchQuery("");
    setShowSearch(false);
    router.push(href);
  };

  const searchIcon = (category: string) => {
    if (category === "Services") return <Layers className="w-3.5 h-3.5" />;
    if (category === "Projects" || category === "Case Studies") return <Briefcase className="w-3.5 h-3.5" />;
    if (category === "Blog") return <PenTool className="w-3.5 h-3.5" />;
    if (category === "Leads") return <Inbox className="w-3.5 h-3.5" />;
    if (category === "Careers") return <Users className="w-3.5 h-3.5" />;
    if (category === "Testimonials") return <Star className="w-3.5 h-3.5" />;
    if (category === "Media") return <Folder className="w-3.5 h-3.5" />;
    return <LayoutDashboard className="w-3.5 h-3.5" />;
  };

  const unread = unreadAdminNotificationCount(notifications);

  const handleMarkAllRead = () => {
    setNotifications(markAllAdminNotificationsRead());
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(dismissAdminNotification(id));
  };

  const handleClearAll = () => {
    setNotifications(clearAllAdminNotifications());
  };

  const kindIcon = (kind: StoredAdminNotif["kind"]) => {
    if (kind === "lead") return <Inbox className="w-4 h-4" />;
    if (kind === "message") return <MessageSquare className="w-4 h-4" />;
    if (kind === "application") return <Briefcase className="w-4 h-4" />;
    if (kind === "visitor") return <Users className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const kindStyle = (kind: StoredAdminNotif["kind"]) => {
    if (kind === "lead") return "bg-cyan-500/10 text-cyan-400";
    if (kind === "message") return "bg-violet-500/10 text-violet-400";
    if (kind === "application") return "bg-emerald-500/10 text-emerald-400";
    if (kind === "visitor") return "bg-sky-500/10 text-sky-400";
    return "bg-amber-500/10 text-amber-400";
  };

  return (
    <header className="h-16 bg-white dark:bg-[#090d16] border-b border-slate-300/80 dark:border-slate-800/80 px-6 flex items-center justify-between z-30 shrink-0 select-none relative">
      <div className="relative max-w-md w-full" ref={searchRef}>
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
        <input
          type="search"
          placeholder="Search leads, services, blog, careers, pages..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearch(true);
          }}
          onFocus={() => setShowSearch(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowSearch(false);
              setSearchQuery("");
            }
            if (e.key === "Enter" && searchResults[0]) {
              e.preventDefault();
              openSearchResult(searchResults[0].href);
            }
          }}
          className="w-full pl-9 pr-9 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Search admin CMS"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setShowSearch(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {showSearch && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {searchResults.length
                ? `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`
                : "No matches"}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-500">
                  No CMS data matched “{searchQuery.trim()}”.
                </div>
              ) : (
                searchResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => openSearchResult(r.href)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/60 last:border-0 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#004d4d]/10 text-[#004d4d] dark:bg-cyan-500/10 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      {searchIcon(r.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {r.subtitle}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-500 shrink-0 mt-1">
                      {r.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            apiConnected
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              apiConnected ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span>{apiConnected ? "Supabase CMS Connected" : "API Offline / Login needed"}</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications((open) => !open);
              void syncFromInbox();
              void refreshLeads();
            }}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors focus:outline-none"
            aria-label="Admin Notifications"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-cyan-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-[26rem] rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Bell className="w-4 h-4 text-[#004d4d] dark:text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                    Notifications ({notifications.length})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-cyan-500 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Read all</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                      title="Remove all notifications"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="px-3 py-8 text-center text-xs text-slate-500">
                    No notifications yet.
                    <div className="mt-1 text-[10px] text-slate-400">
                      New leads, reviews, applications & visitors will appear here and stay until you remove them.
                    </div>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`relative flex items-start gap-3 p-2.5 rounded-xl border transition-colors group ${
                        n.read
                          ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60"
                          : "bg-cyan-500/5 border-cyan-500/25 dark:border-cyan-500/20"
                      }`}
                    >
                      <Link
                        href={n.href}
                        onClick={() => {
                          setNotifications(markAdminNotificationRead(n.id));
                          setShowNotifications(false);
                        }}
                        className="flex items-start gap-3 flex-1 min-w-0"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${kindStyle(n.kind)}`}
                        >
                          {kindIcon(n.kind)}
                        </div>
                        <div className="space-y-0.5 text-left flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors truncate flex items-center gap-1.5">
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            )}
                            <span className="truncate">{n.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {n.body}
                          </div>
                          <div className="text-[10px] text-cyan-400 font-semibold pt-1">
                            {timeAgo(n.createdAt) || "New"} · Open
                          </div>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(n.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Remove this notification"
                        aria-label="Remove notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                <Link
                  href="/admin/leads"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#004d4d] dark:text-cyan-400 hover:underline flex items-center justify-center gap-1"
                >
                  <span>Open Leads CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-[#004d4d] text-white font-bold text-xs flex items-center justify-center border border-cyan-400/40 shadow-sm uppercase">
            {adminName.trim() ? (
              adminName.trim().charAt(0)
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[140px]">
              {adminName}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
