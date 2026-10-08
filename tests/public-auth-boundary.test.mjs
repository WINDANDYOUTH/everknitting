import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { createRouteMatcher } = require("@clerk/nextjs/server");
const { NextRequest, NextResponse } = require("next/server");
const { unstable_doesMiddlewareMatch } = require("next/experimental/testing/server");

// These unit tests use explicit mocks. They do not provision Clerk keys, query a
// database, invoke a Cloudflare service, or send email.
function loadTs(file, mocks = {}, env = {}) {
  const source = readFileSync(resolve(file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: file,
  });
  const loadedModule = { exports: {} };
  const evaluate = vm.runInNewContext(
    `(function(require, module, exports, process) { ${outputText}\n })`,
    { Response, Request, Headers, URL, Error, console },
    { filename: file },
  );
  evaluate(
    (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith("@/")) throw new Error(`Unexpected module access: ${id}`);
      return require(id);
    },
    loadedModule,
    loadedModule.exports,
    { env },
  );
  return loadedModule.exports;
}

const configuredKeys = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "unit-test-publishable-fixture",
  CLERK_SECRET_KEY: "unit-test-secret-fixture",
};

function middlewareHarness(env = {}) {
  const calls = { clerk: 0, protect: 0, intl: 0 };
  const loadedModule = loadTs("middleware.ts", {
    "@clerk/nextjs/server": {
      createRouteMatcher,
      clerkMiddleware: (callback) => async (request) => {
        calls.clerk++;
        return callback({ protect: async () => { calls.protect++; } }, request);
      },
    },
    "next-intl/middleware": () => () => {
      calls.intl++;
      return NextResponse.next();
    },
    "./i18n/routing": { routing: {} },
  }, env);
  return { ...loadedModule, calls };
}

function request(path, options) {
  return new NextRequest(`http://localhost:3000${path}`, options);
}

test("marketing routes bypass Clerk without configuration", async () => {
  const h = middlewareHarness();
  for (const path of ["/", "/en", "/de/contact-us", "/fr/materials", "/es/privacy", "/it/order-checklist"]) {
    const result = await h.default(request(path), {});
    assert.equal(result.status, 200);
  }
  assert.equal(h.calls.clerk, 0);
  assert.equal(h.calls.intl, 6);
});

test("private routes fail closed when either or both keys are missing", async () => {
  for (const env of [{}, { CLERK_SECRET_KEY: "unit-test" }, { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "unit-test" }]) {
    const h = middlewareHarness(env);
    for (const path of ["/dashboard", "/dashboard/leads", "/dashboard/leads/client.pdf", "/en/dashboard", "/api/outbound/stats", "/trpc/example"]) {
      const result = await h.default(request(path), {});
      assert.equal(result.status, 503, path);
      assert.equal(result.headers.get("cache-control"), "no-store");
    }
    assert.equal(h.calls.clerk, 0);
    assert.equal(h.calls.intl, 0);
  }
});

test("configured dashboard requests still invoke Clerk protection", async () => {
  const h = middlewareHarness(configuredKeys);
  await h.default(request("/dashboard/leads"), {});
  assert.equal(h.calls.clerk, 1);
  assert.equal(h.calls.protect, 1);
  assert.equal(h.calls.intl, 0);
  await h.default(request("/api/outbound/stats"), {});
  assert.equal(h.calls.clerk, 2);
  assert.equal(h.calls.protect, 1);
});

test("only the exact public unsubscribe token path bypasses Clerk", async () => {
  const h = middlewareHarness();
  const token = "00000000-0000-4000-8000-000000000000";
  for (const method of ["GET", "POST"]) {
    const result = await h.default(request(`/api/outbound/unsubscribe/${token}`, { method }), {});
    assert.equal(result.status, 200);
  }
  for (const path of ["/api/outbound/unsubscribe", "/api/outbound/unsubscribe/invalid", `/api/outbound/unsubscribe/${token}/extra`, `/api/outbound/stats/${token}`]) {
    assert.equal((await h.default(request(path), {})).status, 503, path);
  }
  assert.equal(h.calls.clerk, 0);
  assert.equal(h.calls.intl, 0);
});

test("Next middleware matcher protects asset-looking dashboard IDs", () => {
  const h = middlewareHarness();
  for (const url of ["/dashboard/leads/client.svg", "/dashboard/leads/client.pdf", "/de/dashboard/leads/client.js", "/api/outbound/stats"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config: h.config, nextConfig: {}, url }), true, url);
  }
  assert.equal(unstable_doesMiddlewareMatch({ config: h.config, nextConfig: {}, url: "/logo.png" }), false);
});

test("CRM guard rejects missing configuration and signed-out users", async () => {
  let authCalls = 0;
  const mocks = {
    "server-only": {},
    "@clerk/nextjs/server": { auth: async () => { authCalls++; return { userId: null }; } },
  };
  await assert.rejects(loadTs("lib/crm-auth.ts", mocks).requireCrmUser(), /not configured/);
  assert.equal(authCalls, 0);
  await assert.rejects(loadTs("lib/crm-auth.ts", mocks, configuredKeys).requireCrmUser(), /Authentication required/);
  assert.equal(authCalls, 1);
  const authenticated = loadTs("lib/crm-auth.ts", {
    ...mocks,
    "@clerk/nextjs/server": { auth: async () => ({ userId: "user_unit_test" }) },
  }, configuredKeys);
  assert.equal(await authenticated.requireCrmUser(), "user_unit_test");
});

test("every CRM action authenticates before data access", async () => {
  for (const reason of ["CRM authentication is not configured.", "Authentication required."]) {
    let guardCalls = 0;
    const mocks = {
      "@/lib/crm-auth": { requireCrmUser: async () => { guardCalls++; throw new Error(reason); } },
      "next/cache": { revalidatePath: () => assert.fail("unexpected revalidation") },
      "next/navigation": { redirect: () => assert.fail("unexpected redirect") },
    };
    // Unmapped Prisma imports throw: a denied call must never load the client.
    const leads = loadTs("app/actions/leads.ts", mocks);
    const detail = loadTs("app/actions/lead-details.ts", mocks);
    await assert.rejects(leads.createLead(new FormData()), { message: reason });
    await assert.rejects(leads.getLeads(), { message: reason });
    await assert.rejects(detail.getLeadById("unit-test-id"), { message: reason });
    assert.equal(guardCalls, 3);
  }
});

test("authorized CRM reads preserve data queries", async () => {
  const calls = [];
  const mocks = {
    "@/lib/crm-auth": { requireCrmUser: async () => { calls.push("auth"); return "user_unit_test"; } },
    "@/lib/prisma": { prisma: { lead: {
      findMany: async (query) => { calls.push({ list: JSON.parse(JSON.stringify(query)) }); return [{ id: "unit-test-id" }]; },
      findUnique: async (query) => { calls.push({ detail: JSON.parse(JSON.stringify(query)) }); return { id: "unit-test-id" }; },
    } } },
    "next/cache": { revalidatePath() {} },
    "next/navigation": { redirect() {} },
  };
  assert.equal((await loadTs("app/actions/leads.ts", mocks).getLeads())[0].id, "unit-test-id");
  assert.equal((await loadTs("app/actions/lead-details.ts", mocks).getLeadById("unit-test-id")).id, "unit-test-id");
  assert.deepEqual(calls, [
    "auth", { list: { orderBy: { createdAt: "desc" } } }, "auth",
    { detail: { where: { id: "unit-test-id" }, include: {
      interactions: { orderBy: { date: "desc" } },
      followUps: { orderBy: { date: "desc" } },
      samples: { orderBy: { createdAt: "desc" } },
    } } },
  ]);
});

test("authorized lead creation preserves validation, fields and redirect", async () => {
  const calls = [];
  const leads = loadTs("app/actions/leads.ts", {
    "@/lib/crm-auth": { requireCrmUser: async () => { calls.push("auth"); return "user_unit_test"; } },
    "@/lib/prisma": { prisma: { lead: { create: async (query) => { calls.push(JSON.parse(JSON.stringify(query))); } } } },
    "next/cache": { revalidatePath: (path) => calls.push({ revalidate: path }) },
    "next/navigation": { redirect: (path) => { calls.push({ redirect: path }); throw new Error("TEST_REDIRECT"); } },
  });
  const form = new FormData();
  for (const [key, value] of Object.entries({ companyName: "Unit Test Company", contactName: "", email: "", country: "", source: "", status: "NEW", owner: "" })) {
    form.set(key, value);
  }
  await assert.rejects(leads.createLead(form), /TEST_REDIRECT/);
  assert.deepEqual(calls, ["auth", { data: {
    companyName: "Unit Test Company", contactName: null, email: null, country: null,
    source: null, status: "NEW", priority: "MEDIUM", owner: null,
  } }, { revalidate: "/dashboard/leads" }, { redirect: "/dashboard/leads" }]);
});

function outboundHarness({ userId = null, token = "unit-test-admin-token", allowed = "user_admin" } = {}) {
  const calls = { auth: 0, forwarded: [] };
  const loadedModule = loadTs("app/api/outbound/[...path]/route.ts", {
    "@clerk/nextjs/server": { auth: async () => { calls.auth++; return { userId }; } },
    "@cloudflare/next-on-pages": { getRequestContext: () => ({ env: {
      OUTBOUND_ADMIN_TOKEN: token,
      OUTBOUND_ADMIN_USER_IDS: allowed,
      OUTBOUND: { fetch: async (req) => { calls.forwarded.push(req); return Response.json({ ok: true }); } },
    } }) },
  });
  return { ...loadedModule, calls };
}

test("Outbound rejects unauthorized users, missing token and foreign/missing Origin", async () => {
  for (const options of [{}, { userId: "user_other" }, { userId: "user_admin", allowed: "" }]) {
    const h = outboundHarness(options);
    assert.equal((await h.GET(request("/api/outbound/stats"), { params: Promise.resolve({ path: ["stats"] }) })).status, 403);
    assert.equal(h.calls.forwarded.length, 0);
  }
  const missing = outboundHarness({ userId: "user_admin", token: "" });
  assert.equal((await missing.GET(request("/api/outbound/stats"), { params: Promise.resolve({ path: ["stats"] }) })).status, 503);
  for (const origin of [undefined, "https://foreign.example"]) {
    const h = outboundHarness({ userId: "user_admin" });
    const req = request("/api/outbound/campaigns", { method: "POST", headers: origin ? { Origin: origin } : {} });
    assert.equal((await h.POST(req, { params: Promise.resolve({ path: ["campaigns"] }) })).status, 403);
    assert.equal(h.calls.forwarded.length, 0);
  }
});

test("Outbound forwards only verified admin identity and its server token", async () => {
  const h = outboundHarness({ userId: "user_admin" });
  const req = request("/api/outbound/campaigns", {
    method: "POST",
    headers: { Origin: "http://localhost:3000", Authorization: "Bearer untrusted", "X-Outbound-Actor": "untrusted" },
  });
  const response = await h.POST(req, { params: Promise.resolve({ path: ["campaigns"] }) });
  assert.equal(response.status, 200);
  assert.equal(h.calls.forwarded.length, 1);
  assert.equal(h.calls.forwarded[0].headers.get("authorization"), "Bearer unit-test-admin-token");
  assert.equal(h.calls.forwarded[0].headers.get("x-outbound-actor"), "user_admin");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("public unsubscribe remains independent of Clerk and admin credentials", async () => {
  const token = "00000000-0000-4000-8000-000000000000";
  for (const method of ["GET", "POST"]) {
    const h = outboundHarness({ token: "", allowed: "" });
    const response = await h[method](request(`/api/outbound/unsubscribe/${token}`, { method }), {
      params: Promise.resolve({ path: ["unsubscribe", token] }),
    });
    assert.equal(response.status, 200);
    assert.equal(h.calls.auth, 0);
    assert.equal(h.calls.forwarded[0].headers.has("authorization"), false);
    assert.equal(h.calls.forwarded[0].headers.has("x-outbound-actor"), false);
  }
});
