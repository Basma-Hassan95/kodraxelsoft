/**
 * Homepage hero slides — loaded from CMS `/public/hero`
 */

import { CMS_API_BASE, cmsFetch, cmsList, isUuid } from "@/lib/cmsApi";

export type HeroSlide = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  mediaUrl: string;
  mediaLink: string;
  isActive: boolean;
  createdAt: string;
};

const PROD_PUBLIC_HERO =
  "https://kodraxelsoft-api.vercel.app/api/public/hero";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || /\/video\//i.test(url);
}

/** Only real image/video URLs — reject placeholder text from admin typos */
export function isUsableMediaUrl(url: string) {
  const u = (url || "").trim();
  if (!u) return false;
  return /^(https?:\/\/|\/|data:)/i.test(u);
}

function mapRow(row: Record<string, unknown>): HeroSlide {
  const ctas = Array.isArray(row.cta_buttons) ? row.cta_buttons : [];
  const firstCta = ctas[0] as { href?: string } | undefined;
  const rawMedia = String(row.hero_image || row.background_image || "");
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    highlight: String(row.highlight_text || ""),
    description: String(row.description || row.subtitle || ""),
    mediaUrl: isUsableMediaUrl(rawMedia) ? rawMedia.trim() : "",
    mediaLink: String(firstCta?.href || ""),
    isActive: row.is_active !== false,
    createdAt: String(row.created_at || ""),
  };
}

export function heroMediaIsVideo(url: string) {
  return Boolean(url && isVideoUrl(url));
}

function heroEndpointCandidates(): string[] {
  const fromEnv = (
    process.env.CMS_API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_CMS_API_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");

  const list: string[] = [];
  // 1) Same-origin BFF in the browser (no CORS issues)
  if (typeof window !== "undefined") {
    list.push("/api/cms/public/hero");
  }
  // 2) Direct production API (works on server + browser)
  list.push(PROD_PUBLIC_HERO);
  // 3) Env-configured API
  if (fromEnv) list.push(`${fromEnv}/public/hero`);
  // 4) Server CMS_API_BASE
  if (typeof window === "undefined" && CMS_API_BASE) {
    list.push(`${CMS_API_BASE.replace(/\/$/, "")}/public/hero`);
  }
  return Array.from(new Set(list));
}

async function parseHeroResponse(res: Response): Promise<HeroSlide[]> {
  const json = await res.json();
  if (!res.ok || json.success === false) return [];
  const raw = json.data;
  const rows = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return rows.map(mapRow).filter((s: HeroSlide) => s.title.trim());
}

/** Public homepage carousel slides (active only). */
export async function loadPublicHeroSlides(): Promise<HeroSlide[]> {
  for (const url of heroEndpointCandidates()) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        next: { revalidate: 0 },
      } as RequestInit);
      const slides = await parseHeroResponse(res);
      if (slides.length) return slides;
    } catch {
      // try next candidate
    }
  }
  return [];
}

/** Admin: all hero slides */
export async function loadAdminHeroSlides(): Promise<HeroSlide[]> {
  const { data } = await cmsList<Record<string, unknown>>("/admin/hero", {
    limit: 50,
    sortBy: "created_at",
    sortOrder: "asc",
  });
  return (data || []).map(mapRow);
}

export async function saveHeroSlide(input: {
  id?: string;
  title: string;
  highlight: string;
  description: string;
  mediaUrl: string;
  mediaLink: string;
  isActive: boolean;
}): Promise<HeroSlide> {
  const media = input.mediaUrl.trim();
  const body = {
    title: input.title.trim(),
    subtitle: input.description.trim().slice(0, 160),
    description: input.description.trim(),
    highlight_text: input.highlight.trim(),
    badge_text: "Elite Engineering Studio",
    hero_image: isUsableMediaUrl(media) ? media : null,
    background_image: null,
    cta_buttons: input.mediaLink.trim()
      ? [{ label: "Open", href: input.mediaLink.trim(), variant: "primary" }]
      : [],
    is_active: input.isActive,
  };

  let row: Record<string, unknown>;
  if (input.id && isUuid(input.id)) {
    const { data } = await cmsFetch<Record<string, unknown>>(
      `/admin/hero/${input.id}`,
      { method: "PUT", body: JSON.stringify(body) }
    );
    row = data;
  } else {
    const { data } = await cmsFetch<Record<string, unknown>>("/admin/hero", {
      method: "POST",
      body: JSON.stringify(body),
    });
    row = data;
  }
  return mapRow(row);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  if (!isUuid(id)) return;
  await cmsFetch(`/admin/hero/${id}`, { method: "DELETE" });
}
