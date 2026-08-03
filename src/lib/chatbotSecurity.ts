import { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY = 8;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Simple in-memory rate limit (per serverless instance). */
export function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (!existing || now >= existing.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (existing.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count += 1;
  return { ok: true };
}

export function sanitizeUserText(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const cleaned = input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
  if (!cleaned) return null;
  if (cleaned.length > MAX_MESSAGE_CHARS) return null;
  return cleaned;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const item of raw.slice(-MAX_HISTORY)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = sanitizeUserText((item as { content?: unknown }).content);
    if ((role === "user" || role === "assistant") && content) {
      out.push({ role, content });
    }
  }
  return out;
}

/** Block obvious prompt-injection / off-site abuse before calling the model. */
export function looksLikeInjection(text: string): boolean {
  const lower = text.toLowerCase();
  const patterns = [
    "ignore previous",
    "ignore all instructions",
    "system prompt",
    "reveal your prompt",
    "api key",
    "openai key",
    "jailbreak",
    "dan mode",
    "developer mode",
  ];
  return patterns.some((p) => lower.includes(p));
}

export function isRomanUrdu(text: string): boolean {
  return /\b(kya|hai|hain|mein|mujhe|aap|kaise|kesay|kitna|batao|btaye|krna|karna|chahiye|woh|yeh|sirf|jee|ji|shukriya|mehrbani|theek|acha|achha)\b/i.test(
    text
  );
}

/** Short greetings / courtesy that deserve a warm reply (still on-scope). */
export function isCourteousMessage(text: string): boolean {
  const t = text.trim().toLowerCase().replace(/[!?.…]+$/g, "").trim();
  if (t.length > 48) return false;
  const patterns = [
    /^(hi|hello|hey|hola|assalamualaikum|assalamu alaikum|salam|salaam)(\s+there)?$/,
    /^(good\s+(morning|afternoon|evening|day))$/,
    /^(thanks|thank\s*you|thx|ty|shukriya|shukria|mehrbani)(\s+so\s+much)?$/,
    /^(ok|okay|oke|k|alright|all\s+right|got\s+it|sure|jee|ji|haan|han|theek|theek\s+hai|acha|achha)$/,
    /^(bye|goodbye|see\s+you|take\s+care|khuda\s+hafiz)$/,
    /^(how\s+are\s+you|how'?s\s+it\s+going)$/,
  ];
  return patterns.some((p) => p.test(t));
}

export function courteousReply(text: string): string {
  const lower = text.trim().toLowerCase();
  const roman = isRomanUrdu(text);

  if (/thank|thx|ty|shukriya|shukria|mehrbani/.test(lower)) {
    return roman
      ? "You're welcome. Agar Kodraxelsoft website ke bare mein aur kuch jaanna ho, bataiye."
      : "You're welcome. If you need anything else about the Kodraxelsoft website, I'm happy to help.";
  }
  if (/^(ok|okay|oke|k|alright|got\s+it|sure|jee|ji|haan|han|theek|acha|achha)/.test(lower)) {
    return roman
      ? "Theek hai. Website se related aur kya information chahiye?"
      : "Understood. What else would you like to know about our website?";
  }
  if (/bye|goodbye|see\s+you|take\s+care|khuda\s+hafiz/.test(lower)) {
    return roman
      ? "Khuda hafiz. Kabhi bhi Kodraxelsoft website ke bare mein poochne ke liye wapas aa sakte hain."
      : "Goodbye. Feel free to return anytime if you have questions about the Kodraxelsoft website.";
  }
  if (/how\s+are\s+you|how'?s\s+it\s+going/.test(lower)) {
    return roman
      ? "Main theek hoon, shukriya. Aap Kodraxelsoft website se related kya jaanna chahenge?"
      : "I'm well, thank you. How can I help you with the Kodraxelsoft website today?";
  }
  return roman
    ? "Hello! Main aapki kaise madad kar sakta/sakti hoon? Kodraxelsoft website se related kya information chahiye?"
    : "Hello! How can I help you today? What information would you like about the Kodraxelsoft website?";
}

export const CHAT_LIMITS = {
  MAX_MESSAGE_CHARS,
  MAX_HISTORY,
  MAX_REQUESTS,
  WINDOW_MS,
} as const;
