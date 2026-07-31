import { NextRequest, NextResponse } from "next/server";

const COOKIE = "kodraxelsoft_admin_session";
const BACKEND =
  process.env.CMS_API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "http://localhost:5000/api";

function backendLooksLocal(url: string) {
  return /localhost|127\.0\.0\.1/.test(url);
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password required" },
      { status: 400 }
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    backendLooksLocal(BACKEND)
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "CMS backend URL missing on Vercel. Set CMS_API_INTERNAL_URL (and NEXT_PUBLIC_CMS_API_URL) to your hosted API, e.g. https://your-api.onrender.com/api — localhost only works on your PC.",
      },
      { status: 503 }
    );
  }

  let upstream: Response;
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    upstream = await fetch(`${BACKEND}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": clientIp,
        "X-Real-IP": clientIp,
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? `Cannot reach CMS API at ${BACKEND}. Host the backend and set CMS_API_INTERNAL_URL in Vercel.`
            : "Cannot reach CMS API. Start backend: cd backend && npm run dev",
      },
      { status: 502 }
    );
  }

  const json = await upstream.json().catch(() => ({}));
  if (!upstream.ok || json.success === false) {
    return NextResponse.json(
      {
        success: false,
        message: json.message || "Invalid email or password",
      },
      { status: upstream.status || 401 }
    );
  }

  const token = json?.data?.token as string | undefined;
  const admin = json?.data?.admin;
  const maxAgeSec = Number(json?.data?.maxAgeSec) || 8 * 60 * 60;

  // Dev backend returns token; prod may omit — read Set-Cookie from upstream if needed
  let sessionToken = token;
  if (!sessionToken) {
    const setCookie = upstream.headers.get("set-cookie") || "";
    const match = setCookie.match(/kodraxelsoft_admin_session=([^;]+)/);
    if (match) sessionToken = decodeURIComponent(match[1]);
  }

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, message: "Login succeeded but no session token returned" },
      { status: 502 }
    );
  }

  const res = NextResponse.json({
    success: true,
    message: "Login successful",
    data: { admin },
  });
  res.cookies.set(COOKIE, sessionToken, cookieOptions(maxAgeSec));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out",
    data: null,
  });
  res.cookies.set(COOKIE, "", cookieOptions(0));
  // Best-effort backend logout
  try {
    await fetch(`${BACKEND}/auth/logout`, { method: "POST", cache: "no-store" });
  } catch {
    /* ignore */
  }
  return res;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const res = NextResponse.json(
        { success: false, message: json.message || "Session expired" },
        { status: 401 }
      );
      res.cookies.set(COOKIE, "", cookieOptions(0));
      return res;
    }
    return NextResponse.json({ success: true, data: json.data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Cannot verify session" },
      { status: 502 }
    );
  }
}
