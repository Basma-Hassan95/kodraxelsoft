"use client";

import React, { Suspense } from "react";
import { AdminAuthForm } from "@/components/admin/AdminAuthForm";

export default function AdminIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] flex items-center justify-center text-sm font-semibold text-[#004d4d] dark:text-cyan-400">
          Loading admin login…
        </div>
      }
    >
      <AdminAuthForm />
    </Suspense>
  );
}
