import type { SiteSettings } from "@/types/admin";
import { CMS_API_BASE } from "@/lib/cmsApi";
import { settingsFromApi } from "@/lib/cmsMappers";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Kodraxelsoft Inc.",
  contactEmail: "kodraxelsoft@gmail.com",
  contactPhone: "03372027510",
  address: "Market Street, Suite 1400, San Francisco, CA",
  githubUrl: "https://github.com",
  linkedinUrl: "https://www.linkedin.com/company/kodraxelsoft",
  twitterUrl: "https://twitter.com",
  instagramUrl: "https://www.instagram.com/kodraxelsoft",
  facebookUrl: "https://www.facebook.com/kodraxelsoft",
  metaTitle: "Kodraxelsoft | Custom Software & AI Tools for Growing Businesses",
  metaDescription:
    "We build simple digital tools, smart AI helpers, and custom websites that save you time and grow your sales. No confusing tech speak.",
  keywords:
    "custom software, AI tools, business websites, automation, Kodraxelsoft",
  ogImageUrl: "/logo.png",
};

function mergeSettings(partial: SiteSettings | null): SiteSettings {
  if (!partial) return { ...DEFAULT_SITE_SETTINGS };
  const merged = { ...DEFAULT_SITE_SETTINGS };
  (Object.keys(DEFAULT_SITE_SETTINGS) as (keyof SiteSettings)[]).forEach((key) => {
    const value = partial[key];
    if (typeof value === "string" && value.trim()) {
      merged[key] = value.trim();
    }
  });
  // Drop old demo US number if still stored in CMS
  const digits = merged.contactPhone.replace(/\D/g, "");
  if (digits.includes("4158904221") || merged.contactPhone.includes("415")) {
    merged.contactPhone = DEFAULT_SITE_SETTINGS.contactPhone;
  }
  return merged;
}

/**
 * Digits-only phone for wa.me links.
 * Pakistan local numbers like 0337... → 92337...
 */
export function toWhatsAppNumber(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  // Local PK mobile: 03XXXXXXXXX → 923XXXXXXXXX
  if (digits.startsWith("0") && digits.length === 11) {
    digits = `92${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Live site settings from CMS (Site Settings admin).
 * Falls back to defaults if API is offline.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${CMS_API_BASE}/public/settings`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { ...DEFAULT_SITE_SETTINGS };
    const json = await res.json();
    const mapped = settingsFromApi(
      (json?.data as Record<string, unknown>) || null
    );
    return mergeSettings(mapped);
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}
