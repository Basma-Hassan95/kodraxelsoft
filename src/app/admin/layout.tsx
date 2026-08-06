"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { AdminNavProvider } from "@/components/admin/AdminNavContext";
import { AdminUiProvider } from "@/components/admin/AdminUiContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { apiMe, apiLogout, clearAdminToken } from "@/lib/cmsApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage =
    pathname === "/admin" ||
    pathname === "/admin/" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/");

  useEffect(() => {
    let cancelled = false;

    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    setIsAuthenticated(null);

    void (async () => {
      try {
        const me = await apiMe();
        if (cancelled) return;
        if (!me?.id || !me?.email) {
          throw new Error("Invalid session");
        }
        if (me.name) {
          sessionStorage.setItem("kodraxelsoft_admin_name", me.name);
          localStorage.setItem("kodraxelsoft_admin_name", me.name);
        }
        setIsAuthenticated(true);
      } catch {
        if (cancelled) return;
        clearAdminToken();
        try {
          await apiLogout();
        } catch {
          /* ignore */
        }
        router.replace("/admin/login");
        setIsAuthenticated(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <AdminDataProvider>{children}</AdminDataProvider>;
  }

  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-sm px-4 text-center">
        Verifying secure admin session...
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <AdminUiProvider>
        <AdminNavProvider>
          <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex overflow-x-hidden relative font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
              <AdminHeader />
              <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 overflow-x-auto">
                {children}
              </main>
            </div>
          </div>
        </AdminNavProvider>
      </AdminUiProvider>
    </AdminDataProvider>
  );
}
