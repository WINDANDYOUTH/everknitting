import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
type Bindings = {
  OUTBOUND?: { fetch(request: Request): Promise<Response> };
  OUTBOUND_ADMIN_TOKEN?: string;
  OUTBOUND_ADMIN_USER_IDS?: string;
};
async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const isPublic =
    path.length === 2 &&
    path[0] === "unsubscribe" &&
    /^[a-f0-9-]{36}$/.test(path[1]);
  let env: Bindings;
  try {
    env = getRequestContext().env as unknown as Bindings;
  } catch {
    return Response.json(
      { error: "Cloudflare Pages runtime required" },
      { status: 503 },
    );
  }
  if (!env.OUTBOUND)
    return Response.json(
      { error: "OUTBOUND service binding is not configured" },
      { status: 503 },
    );
  const headers = new Headers({
    "Content-Type": request.headers.get("Content-Type") || "application/json",
  });
  if (!isPublic) {
    const { userId } = await auth();
    const allowed = (env.OUTBOUND_ADMIN_USER_IDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!userId || !allowed.includes(userId))
      return Response.json(
        { error: userId ? `Administrator access is not enabled for this login. Your Clerk User ID: ${userId}` : "Sign in to access Outbound." },
        { status: 403 },
      );
    if (!env.OUTBOUND_ADMIN_TOKEN)
      return Response.json(
        { error: "Outbound secret missing" },
        { status: 503 },
      );
    if (
      request.method === "POST" &&
      request.headers.get("Origin") !== request.nextUrl.origin
    )
      return Response.json({ error: "Invalid origin" }, { status: 403 });
    headers.set("Authorization", `Bearer ${env.OUTBOUND_ADMIN_TOKEN}`);
    headers.set("X-Outbound-Actor", userId);
  }
  const target = new URL(
    `https://outbound.internal/${path.map(encodeURIComponent).join("/")}`,
  );
  const response = await env.OUTBOUND.fetch(
    new Request(target, {
      method: request.method,
      headers,
      body: request.method === "GET" ? undefined : request.body,
    }),
  );
  const outgoing = new Headers(response.headers);
  outgoing.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    headers: outgoing,
  });
}
export const GET = proxy;
export const POST = proxy;
