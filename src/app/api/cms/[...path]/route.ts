import { NextRequest, NextResponse } from "next/server";

const COOKIE = "kodraxelsoft_admin_session";
const BACKEND =
  process.env.CMS_API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "http://localhost:5000/api";

type Ctx = { params: Promise<{ path: string[] }> };

/**
 * Same-origin BFF proxy: browser talks to /api/cms/*,
 * Next attaches HttpOnly JWT and forwards to Express.
 */
export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx);
}

async function proxy(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const segments = path || [];
  const subPath = segments.join("/");
  const search = req.nextUrl.search || "";
  const target = `${BACKEND}/${subPath}${search}`;

  const isPublic =
    subPath.startsWith("public/") ||
    subPath === "auth/login" ||
    subPath === "auth/bootstrap" ||
    subPath === "auth/logout";

  const token = req.cookies.get(COOKIE)?.value;
  if (!isPublic && !token) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const bootstrapKey = req.headers.get("x-bootstrap-key");
  if (bootstrapKey) headers.set("x-bootstrap-key", bootstrapKey);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  headers.set("x-forwarded-for", clientIp);
  headers.set("x-real-ip", clientIp);

  let body: ArrayBuffer | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "CMS API unreachable" },
      { status: 502 }
    );
  }

  const resBody = await upstream.arrayBuffer();
  const resHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) resHeaders.set("content-type", upstreamType);

  return new NextResponse(resBody, {
    status: upstream.status,
    headers: resHeaders,
  });
}
