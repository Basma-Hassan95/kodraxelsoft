"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Admin3DCanvas } from "@/components/admin/Admin3DCanvas";

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
    const auth = sessionStorage.getItem("kodraxelsoft_admin_auth");
    if (!auth && !isLoginPage) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <AdminDataProvider>{children}</AdminDataProvider>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-sm">
        Authenticating Admin Session...
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex overflow-hidden relative font-sans">
        {/* 3D WebGL Background Canvas */}
        <Admin3DCanvas />

        {/* WordPress-Style Left Sidebar */}
        <AdminSidebar />

        {/* Main Content Workspace */}
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
