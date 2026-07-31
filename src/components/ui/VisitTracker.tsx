"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackWebsiteVisit } from "@/lib/cmsApi";

/**
 * Invisible tracker — records public page visits for Admin → Visitors.
 * Does not render any UI.
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    void trackWebsiteVisit(pathname, document.title);
  }, [pathname]);

  return null;
}
