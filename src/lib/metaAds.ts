/**
 * Meta Ads — API/Supabase is source of truth.
 * localStorage is only a short offline cache of the last API response.
 */

import { CMS_API_BASE, cmsFetch, cmsList, isUuid } from "@/lib/cmsApi";

export const META_ADS_KEY = "kodraxelsoft_meta_ads";
export const META_ADS_EVENT = "kodraxelsoft_meta_ads_updated";

export type AdChannel = "LinkedIn" | "Instagram" | "Meta / Facebook" | "Other";
export type AdStatus = "active" | "inactive" | "draft";

export type MetaAd = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  link: string;
  status: AdStatus;
  display_order: number;
  channel: AdChannel;
  badge: string;
  created_at: string;
  updated_at: string;
};

const CHANNELS: AdChannel[] = [
  "LinkedIn",
  "Instagram",
  "Meta / Facebook",
  "Other",
];

const PROD_PUBLIC_META_ADS =
  "https://kodraxelsoft-api.vercel.app/api/public/meta-ads";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(META_ADS_EVENT));
  }
}

function asChannel(value: unknown): AdChannel {
  const s = String(value || "");
  return (CHANNELS.includes(s as AdChannel) ? s : "Meta / Facebook") as AdChannel;
}

function mapApiRow(row: Record<string, unknown>, i = 0): MetaAd {
  if (!row || typeof row !== "object") {
    throw new Error("Invalid meta ad payload from API");
  }
  const id = String(row.id);
  const cached = readCache().find((a) => a.id === id);
  const hasChannel = row.channel != null && String(row.channel).trim() !== "";
  const hasBadge = row.badge != null && String(row.badge).trim() !== "";
  return {
    id,
    title: String(row.title || ""),
    description: String(row.description || ""),
    image_url: String(row.image_url || ""),
    cta_text: String(row.cta_text || "Learn More"),
    link: String(row.link || "/contact"),
    status: (row.status as AdStatus) || "active",
    display_order: Number(row.display_order ?? i) || 0,
    channel: hasChannel
      ? asChannel(row.channel)
      : cached?.channel || "Meta / Facebook",
    badge: hasBadge
      ? String(row.badge)
      : cached?.badge || "Sponsored Campaign",
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

function cacheAds(ads: MetaAd[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(META_ADS_KEY, JSON.stringify(ads));
  notify();
}

function readCache(): MetaAd[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(META_ADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MetaAd[];
    return Array.isArray(parsed) ? parsed.filter((a) => isUuid(a.id)) : [];
  } catch {
    return [];
  }
}

/** Clear stale local seed ads once */
export function clearStaleLocalMetaAds() {
  if (typeof window === "undefined") return;
  const cleaned = readCache();
  localStorage.setItem(META_ADS_KEY, JSON.stringify(cleaned));
}

export function getActiveMetaAds(): MetaAd[] {
  return readCache()
    .filter((a) => a.status === "active")
    .sort((a, b) => a.display_order - b.display_order);
}

function toApiBody(ad: MetaAd) {
  return {
    title: ad.title.trim(),
    description: ad.description.trim(),
    image_url: ad.image_url.trim() || null,
    cta_text: ad.cta_text.trim() || "Learn More",
    link: ad.link.trim() || "/contact",
    status: ad.status,
    display_order: Number.isFinite(ad.display_order) ? ad.display_order : 0,
    channel: ad.channel || "Meta / Facebook",
    badge: ad.badge?.trim() || "Sponsored Campaign",
  };
}

function metaAdsEndpointCandidates(): string[] {
  const fromEnv = (
    process.env.CMS_API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_CMS_API_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");

  const list: string[] = [];
  // 1) Same-origin BFF (browser — no CORS)
  if (typeof window !== "undefined") {
    list.push("/api/cms/public/meta-ads?limit=50");
  }
  // 2) Production public API
  list.push(`${PROD_PUBLIC_META_ADS}?limit=50`);
  // 3) Env-configured API
  if (fromEnv) list.push(`${fromEnv}/public/meta-ads?limit=50`);
  // 4) Server-side CMS_API_BASE
  if (typeof window === "undefined" && CMS_API_BASE) {
    list.push(`${CMS_API_BASE.replace(/\/$/, "")}/public/meta-ads?limit=50`);
  }
  return Array.from(new Set(list));
}

async function parseMetaAdsResponse(res: Response): Promise<MetaAd[]> {
  const json = await res.json();
  if (!res.ok || json.success === false || !Array.isArray(json.data)) return [];
  return json.data
    .map((row: Record<string, unknown>, i: number) => mapApiRow(row, i))
    .filter((a: MetaAd) => a.status === "active")
    .sort((a: MetaAd, b: MetaAd) => a.display_order - b.display_order);
}

/** Admin: load from backend (auth). */
export async function loadAdminMetaAds(): Promise<MetaAd[]> {
  clearStaleLocalMetaAds();
  const { data } = await cmsList<Record<string, unknown>>("/admin/meta-ads", {
    limit: 100,
    sortBy: "display_order",
    sortOrder: "asc",
  });
  const ads = (data || []).map((row, i) => mapApiRow(row, i));
  cacheAds(ads);
  return ads;
}

/**
 * Public website: active ads from CMS API (BFF → Express → Supabase).
 * Returns [] when none / offline — UI may show demo cards as fallback.
 */
export async function loadPublicMetaAds(): Promise<MetaAd[]> {
  clearStaleLocalMetaAds();

  for (const url of metaAdsEndpointCandidates()) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      } as RequestInit);
      const ads = await parseMetaAdsResponse(res);
      // Prefer the first non-empty source (BFF → prod → env), same as heroCms
      if (ads.length) {
        cacheAds(ads);
        return ads;
      }
    } catch {
      // try next candidate
    }
  }

  // Last resort: UUID-only cache from a previous successful fetch
  const cached = getActiveMetaAds();
  if (cached.length) return cached;
  cacheAds([]);
  return [];
}

export async function loadPublicMetaAdById(id: string): Promise<MetaAd | null> {
  if (!id) return null;
  const list = await loadPublicMetaAds();
  const fromList = list.find((a) => a.id === id);
  if (fromList) return fromList;

  const cached = readCache().find(
    (a) => a.id === id && a.status === "active"
  );
  return cached || null;
}

/**
 * Create or update a meta ad in Supabase.
 * UUID id → PUT update. Anything else → POST create.
 */
export async function saveMetaAd(ad: MetaAd): Promise<MetaAd> {
  const body = toApiBody(ad);
  const updating = isUuid(ad.id);

  let row: Record<string, unknown>;
  if (updating) {
    const { data } = await cmsFetch<Record<string, unknown>>(
      `/admin/meta-ads/${ad.id}`,
      { method: "PUT", body: JSON.stringify(body) }
    );
    row = data;
  } else {
    const { data } = await cmsFetch<Record<string, unknown>>("/admin/meta-ads", {
      method: "POST",
      body: JSON.stringify(body),
    });
    row = data;
  }

  if (!row || !row.id) {
    throw new Error(updating ? "Update failed — empty response" : "Create failed — empty response");
  }

  // Preserve channel/badge from the form (DB may not have those columns yet)
  const saved = mapApiRow({
    ...row,
    channel: row.channel ?? ad.channel,
    badge: row.badge ?? ad.badge,
  });

  const next = readCache();
  const idx = next.findIndex((a) => a.id === saved.id);
  if (idx >= 0) next[idx] = saved;
  else next.push(saved);
  cacheAds(next.sort((a, b) => a.display_order - b.display_order));

  return saved;
}

export async function deleteMetaAd(id: string): Promise<void> {
  if (!isUuid(id)) {
    cacheAds(readCache().filter((a) => a.id !== id));
    return;
  }
  await cmsFetch(`/admin/meta-ads/${id}`, { method: "DELETE" });
  cacheAds(readCache().filter((a) => a.id !== id));
}

export async function toggleMetaAdStatus(
  id: string,
  status: AdStatus
): Promise<void> {
  const current = readCache().find((a) => a.id === id);
  if (!current) throw new Error("Ad not found in cache — refresh and try again");
  await saveMetaAd({ ...current, status });
}

// Back-compat aliases used by older code
export const readMetaAds = readCache;
export const writeMetaAds = cacheAds;
