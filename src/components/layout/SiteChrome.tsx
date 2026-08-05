"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PortfolioChatbot } from "@/components/ui/PortfolioChatbot";
import { GSAPRouteRefresh } from "@/components/ui/GSAPRouteRefresh";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { IntroVideoSplash } from "@/components/ui/IntroVideoSplash";
import { VisitTracker } from "@/components/ui/VisitTracker";
import type { SiteSettings } from "@/types/admin";

type SiteChromeProps = {
  settings: SiteSettings;
  children: React.ReactNode;
};

/** Public site chrome — hidden on /admin so CMS is a full-screen app. */
export function SiteChrome({ settings, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-full flex flex-col">
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  return (
    <>
      <IntroVideoSplash />
      <VisitTracker />
      <SmoothScroll>
        <GSAPRouteRefresh />
        <Navbar />
        <main className="flex-grow pt-24">{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton
          phone={settings.contactPhone}
          companyName={settings.companyName}
        />
        <PortfolioChatbot />
      </SmoothScroll>
    </>
  );
}
