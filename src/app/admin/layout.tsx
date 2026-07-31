"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Admin3DCanvas } from "@/components/admin/Admin3DCanvas";
import { apiMe, apiLogout, clearAdminToken } from "@/lib/cmsApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin/login";

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
        if (me?.name) {
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
      <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-sm">
        Verifying secure admin session...
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex overflow-hidden relative font-sans">
        <Admin3DCanvas />
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 overflow-y-auto">
          <AdminHeader />
          <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
