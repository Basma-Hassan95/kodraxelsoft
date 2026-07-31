/**
 * Persistent admin notification feed (browser localStorage).
 * New inbox events are merged in; admin dismisses items manually.
 * Dismissed IDs are remembered so they do not reappear on poll.
 */

export type AdminNotifKind =
  | "lead"
  | "message"
  | "review"
  | "application"
  | "visitor";

export type StoredAdminNotif = {
  id: string;
  href: string;
  title: string;
  body: string;
  createdAt: string;
  kind: AdminNotifKind;
  read: boolean;
};

const STORAGE_KEY = "kodraxelsoft_admin_notifications_v2";
const DISMISSED_KEY = "kodraxelsoft_admin_notifications_dismissed_v2";
const MAX_ITEMS = 80;
const MAX_DISMISSED = 300;

function canUseStorage() {
  return typeof window !== "undefined";
}

function loadDismissedIds(): Set<string> {
  if (!canUseStorage()) return new Set();
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveDismissedIds(ids: Set<string>) {
  if (!canUseStorage()) return;
  localStorage.setItem(
    DISMISSED_KEY,
    JSON.stringify(Array.from(ids).slice(-MAX_DISMISSED))
  );
}

export function loadAdminNotifications(): StoredAdminNotif[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAdminNotif[];
    if (!Array.isArray(parsed)) return [];
    const dismissed = loadDismissedIds();
    return parsed.filter((n) => n && typeof n.id === "string" && !dismissed.has(n.id));
  } catch {
    return [];
  }
}

export function saveAdminNotifications(items: StoredAdminNotif[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function mergeAdminNotifications(
  incoming: Array<Omit<StoredAdminNotif, "read">>
): StoredAdminNotif[] {
  const dismissed = loadDismissedIds();
  const existing = loadAdminNotifications();
  const map = new Map(existing.map((n) => [n.id, n]));

  for (const item of incoming) {
    if (!item?.id || dismissed.has(item.id)) continue;
    const prev = map.get(item.id);
    if (prev) {
      map.set(item.id, {
        ...prev,
        title: item.title,
        body: item.body,
        href: item.href,
        kind: item.kind,
        createdAt: item.createdAt || prev.createdAt,
      });
    } else {
      map.set(item.id, { ...item, read: false });
    }
  }

  const merged = Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const capped = merged.slice(0, MAX_ITEMS);
  saveAdminNotifications(capped);
  return capped;
}

export function dismissAdminNotification(id: string): StoredAdminNotif[] {
  const dismissed = loadDismissedIds();
  dismissed.add(id);
  saveDismissedIds(dismissed);
  const next = loadAdminNotifications().filter((n) => n.id !== id);
  saveAdminNotifications(next);
  return next;
}

export function markAdminNotificationRead(id: string): StoredAdminNotif[] {
  const next = loadAdminNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveAdminNotifications(next);
  return next;
}

export function markAllAdminNotificationsRead(): StoredAdminNotif[] {
  const next = loadAdminNotifications().map((n) => ({ ...n, read: true }));
  saveAdminNotifications(next);
  return next;
}

export function clearAllAdminNotifications(): StoredAdminNotif[] {
  const dismissed = loadDismissedIds();
  for (const n of loadAdminNotifications()) dismissed.add(n.id);
  saveDismissedIds(dismissed);
  saveAdminNotifications([]);
  return [];
}

export function unreadAdminNotificationCount(items: StoredAdminNotif[]) {
  return items.filter((n) => !n.read).length;
}
