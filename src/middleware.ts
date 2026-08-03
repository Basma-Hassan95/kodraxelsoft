import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "kodraxelsoft_admin_session";

const BACKEND =
  process.env.CMS_API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "http://localhost:5000/api";

function isPublicAuthPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname === "/admin/" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  );
}

function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !isPublicAuthPath(request.nextUrl.pathname)
  ) {
    url.searchParams.set("next", request.nextUrl.pathname);
  } else {
    url.search = "";
  }
  return clearSessionCookie(NextResponse.redirect(url));
}

async function sessionIsValid(token: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const upstream = await fetch(`${BACKEND}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return upstream.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value?.trim();

  // /admin and /admin/login — show Sign Up / Sign In form (no CMS access yet)
  if (isPublicAuthPath(pathname)) {
    if (token) {
      const valid = await sessionIsValid(token);
      if (valid) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
      }
      const res = NextResponse.next();
      return clearSessionCookie(res);
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a verified admin session
  if (!token) {
    return redirectToLogin(request);
  }

  const valid = await sessionIsValid(token);
  if (!valid) {
    return redirectToLogin(request);
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
