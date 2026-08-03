"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type AdminNavContextValue = {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
};

const AdminNavContext = createContext<AdminNavContextValue | null>(null);

export function useAdminNav() {
  const ctx = useContext(AdminNavContext);
  if (!ctx) {
    throw new Error("useAdminNav must be used within AdminNavProvider");
  }
  return ctx;
}

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <AdminNavContext.Provider
      value={{
        mobileOpen,
        openMobile: () => setMobileOpen(true),
        closeMobile: () => setMobileOpen(false),
        toggleMobile: () => setMobileOpen((v) => !v),
      }}
    >
      {children}
    </AdminNavContext.Provider>
  );
}
