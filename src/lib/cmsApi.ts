/**
 * Kodraxelsoft CMS API client — Admin Panel ↔ Express/Supabase
 * Browser uses same-origin BFF (/api/cms) with HttpOnly session cookie.
 * Server components may call the Express API directly.
 */

export const CMS_API_BASE =
  typeof window === "undefined"
    ? process.env.CMS_API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_CMS_API_URL ||
      "http://localhost:5000/api"
    : "/api/cms";

const TOKEN_KEY = "kodraxelsoft_admin_token";
const VIEWS_KEY = "kodraxelsoft_page_views";
const SESSION_KEY = "kodraxelsoft_visitor_session";

export type ApiListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiListResult<T> = { data: T[]; meta?: ApiListMeta };

/** Legacy helpers — JWT is now HttpOnly; these no longer store secrets in JS. */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  // sessionStorage leftover cleanup for older builds
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(_token: string) {
  // Intentionally no-op: session lives in HttpOnly cookie via /api/admin/session
  clearLegacyTokenStorage();
}

export function clearAdminToken() {
  clearLegacyTokenStorage();
}

function clearLegacyTokenStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem("kodraxelsoft_admin_auth");
  sessionStorage.removeItem("kodraxelsoft_admin_name");
  localStorage.removeItem("kodraxelsoft_admin_name");
  localStorage.removeItem("kodraxelsoft_admin_credentials");
}

export function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiListMeta;
  errors?: unknown;
};

function redirectToLogin() {
  if (typeof window === "undefined") return;
  clearLegacyTokenStorage();
  const path = window.location.pathname;
  const onAuthGate =
    path === "/admin" ||
    path === "/admin/" ||
    path === "/admin/login" ||
    path.startsWith("/admin/login/");
  if (!onAuthGate) {
    window.location.href = "/admin/login";
  }
}

export async function cmsFetch<T>(
  path: string,
  init: RequestInit = {},
  opts: { auth?: boolean } = { auth: true }
): Promise<{ data: T; meta?: ApiListMeta }> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // Prefer HttpOnly cookie via BFF; fall back to legacy Bearer during migration
  if (opts.auth !== false && typeof window === "undefined") {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } else if (opts.auth !== false && typeof window !== "undefined") {
    const legacy = getAdminToken();
    if (legacy) headers.Authorization = `Bearer ${legacy}`;
  }

  const res = await fetch(`${CMS_API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });

  let json: ApiEnvelope<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid API response (${res.status})`);
  }

  if (res.status === 401 && opts.auth !== false) {
    redirectToLogin();
    throw new Error(json.message || "Session expired — please log in again");
  }

  if (!res.ok || json.success === false) {
    const details = Array.isArray(json.errors)
      ? json.errors
          .map((e) => {
            if (e && typeof e === "object" && "message" in e) {
              return String((e as { message: unknown }).message);
            }
            return String(e);
          })
          .filter(Boolean)
          .join("; ")
      : "";
    throw new Error(
      [json.message || `API error ${res.status}`, details]
        .filter(Boolean)
        .join(" — ")
    );
  }

  return { data: json.data, meta: json.meta };
}

export async function cmsList<T>(
  path: string,
  query: Record<string, string | number | boolean | undefined> = {},
  auth = true
): Promise<ApiListResult<T>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  if (!params.has("limit")) params.set("limit", "100");
  const qs = params.toString();
  const result = await cmsFetch<T[]>(`${path}?${qs}`, {}, { auth });
  return { data: result.data || [], meta: result.meta };
}

export const apiList = cmsList;

/** Auth — secure session cookie via Next BFF */
export async function apiLogin(email: string, password: string) {
  const res = await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Invalid email or password");
  }
  clearLegacyTokenStorage();
  return json.data as {
    admin: { id: string; name: string; email: string };
  };
}

export async function apiLogout() {
  clearLegacyTokenStorage();
  try {
    await fetch("/api/admin/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {
    /* ignore */
  }
}

export async function apiBootstrapAdmin(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await cmsFetch(
    "/auth/bootstrap",
    { method: "POST", body: JSON.stringify(payload) },
    { auth: false }
  );
  return data;
}

export async function apiMe() {
  // Prefer BFF session check (validates cookie + backend)
  if (typeof window !== "undefined") {
    const res = await fetch("/api/admin/session", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.success === false) {
      redirectToLogin();
      throw new Error(json.message || "Not authenticated");
    }
    const data = json.data as { id?: string; name?: string; email?: string } | null;
    if (!data?.id || !data?.email) {
      redirectToLogin();
      throw new Error("Invalid session");
    }
    return data as { id: string; name: string; email: string };
  }
  const { data } = await cmsFetch<{ id: string; name: string; email: string }>(
    "/auth/me"
  );
  if (!data?.id || !data?.email) {
    throw new Error("Invalid session");
  }
  return data;
}

/** Generic CRUD helpers */
export async function apiCreate<T>(path: string, body: unknown) {
  const { data } = await cmsFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function apiUpdate<T>(path: string, body: unknown) {
  const { data } = await cmsFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return data;
}

export async function apiPatch<T>(path: string, body: unknown) {
  const { data } = await cmsFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function apiDelete(path: string) {
  await cmsFetch(path, { method: "DELETE" });
}

export async function apiUploadMedia(file: File, folder = "uploads") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const { data } = await cmsFetch<{
    id: string;
    filename: string;
    url: string;
    size_bytes: number;
    media_type: string;
    created_at: string;
  }>("/admin/media/upload", { method: "POST", body: form });
  return data;
}

export async function pingCmsApi(): Promise<boolean> {
  try {
    const base =
      process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:5000/api";
    const healthUrl = `${base.replace(/\/api\/?$/, "")}/health`;
    const res = await fetch(healthUrl, { method: "GET", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Visitors (kept from previous implementation)                               */
/* -------------------------------------------------------------------------- */

export type LocalPageView = {
  id: string;
  session_id: string;
  page_path: string;
  page_title: string;
  referrer: string;
  device_type: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  is_unique_daily: boolean;
  created_at: string;
};

function detectDevice(): LocalPageView["device_type"] {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua))
    return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "Other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  return "Other";
}

function detectOs(): string {
  if (typeof navigator === "undefined") return "Other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("linux")) return "Linux";
  return "Other";
}

function readViews(): LocalPageView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? (JSON.parse(raw) as LocalPageView[]) : [];
  } catch {
    return [];
  }
}

function writeViews(views: LocalPageView[]) {
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views.slice(0, 2000)));
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${crypto.randomUUID()}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function startOfTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function trackWebsiteVisit(pagePath?: string, pageTitle?: string) {
  if (typeof window === "undefined") return;
  const path = pagePath || window.location.pathname;
  if (path.startsWith("/admin")) return;

  const session_id = getOrCreateSessionId();
  const todayStart = startOfTodayISO();
  const existing = readViews();
  const alreadyToday = existing.some(
    (v) => v.session_id === session_id && v.created_at >= todayStart
  );

  const view: LocalPageView = {
    id: crypto.randomUUID(),
    session_id,
    page_path: path,
    page_title: pageTitle || document.title || path,
    referrer: document.referrer || "",
    device_type: detectDevice(),
    browser: detectBrowser(),
    os: detectOs(),
    is_unique_daily: !alreadyToday,
    created_at: new Date().toISOString(),
  };

  writeViews([view, ...existing]);

  try {
    await fetch(`${CMS_API_BASE}/public/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id,
        page_path: view.page_path,
        page_title: view.page_title,
        referrer: view.referrer,
        user_agent: navigator.userAgent,
      }),
    });
  } catch {
    /* local ok */
  }
}

export type VisitorsSummary = {
  totalViews: number;
  totalUniqueVisitorsApprox: number;
  today: { views: number; uniqueVisitors: number };
  last7Days: { views: number; uniqueVisitors: number };
  thisMonth: { views: number; uniqueVisitors: number };
};

export type VisitorsOverview = {
  summary: VisitorsSummary;
  daily: { stat_date: string; total_views: number; unique_visitors: number }[];
  topPages: { page_path: string; views: number }[];
  recentVisits: Array<{
    id: string;
    page_path: string;
    page_title?: string;
    referrer?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    created_at: string;
    is_unique_daily?: boolean;
  }>;
  source: "api" | "local";
};

function countUniqueDaily(views: LocalPageView[], sinceISO: string) {
  return views.filter((v) => v.created_at >= sinceISO && v.is_unique_daily).length;
}

function buildLocalOverview(): VisitorsOverview {
  const views = readViews();
  const now = new Date();
  const todayStart = startOfTodayISO();
  const week = new Date(now);
  week.setDate(week.getDate() - 6);
  week.setHours(0, 0, 0, 0);
  const month = new Date(now.getFullYear(), now.getMonth(), 1);
  const since = (iso: string) => views.filter((v) => v.created_at >= iso);
  const todayViews = since(todayStart);
  const weekViews = since(week.toISOString());
  const monthViews = since(month.toISOString());

  const pageCounts: Record<string, number> = {};
  for (const v of views) {
    pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .map(([page_path, count]) => ({ page_path, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const dailyMap: Record<string, { total_views: number; unique_visitors: number }> =
    {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { total_views: 0, unique_visitors: 0 };
  }
  for (const v of views) {
    const key = v.created_at.slice(0, 10);
    if (!dailyMap[key]) continue;
    dailyMap[key].total_views += 1;
    if (v.is_unique_daily) dailyMap[key].unique_visitors += 1;
  }

  return {
    source: "local",
    summary: {
      totalViews: views.length,
      totalUniqueVisitorsApprox: views.filter((v) => v.is_unique_daily).length,
      today: {
        views: todayViews.length,
        uniqueVisitors: countUniqueDaily(views, todayStart),
      },
      last7Days: {
        views: weekViews.length,
        uniqueVisitors: countUniqueDaily(views, week.toISOString()),
      },
      thisMonth: {
        views: monthViews.length,
        uniqueVisitors: countUniqueDaily(views, month.toISOString()),
      },
    },
    daily: Object.entries(dailyMap).map(([stat_date, stats]) => ({
      stat_date,
      ...stats,
    })),
    topPages,
    recentVisits: views.slice(0, 25).map((v) => ({
      id: v.id,
      page_path: v.page_path,
      page_title: v.page_title,
      referrer: v.referrer,
      device_type: v.device_type,
      browser: v.browser,
      os: v.os,
      created_at: v.created_at,
      is_unique_daily: v.is_unique_daily,
    })),
  };
}

export async function loadVisitorsOverview(): Promise<VisitorsOverview> {
  try {
    const { data } = await cmsFetch<Omit<VisitorsOverview, "source">>(
      "/admin/analytics"
    );
    return { ...data, source: "api" };
  } catch {
    return buildLocalOverview();
  }
}

/** Legacy export — visitors page previously checked this */
export const CMS_API_ENABLED = true;
