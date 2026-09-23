import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { handle } from "../src/index";
import { deliver, receive } from "../src/delivery";
import { budget, now, stmt, suppress, type Environment } from "../src/db";
import { domainOf, readBounded } from "../src/core";
import { tick } from "../src/scheduler";
import { claim, complete } from "../src/agent";

// Execute the real SQL/migration against SQLite, with a D1-shaped adapter.
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    readFileSync(
      new NodeURL("../migrations/0001_outbound.sql", import.meta.url),
      "utf8",
    ),
  );
  function prepare(sql: string, values: any[] = []): any {
    return {
      bind: (...v: any[]) => prepare(sql, v),
      first: async () => sqlite.prepare(sql).get(...values) || null,
      all: async () => ({
        results: sqlite.prepare(sql).all(...values),
        success: true,
      }),
      run: async () => {
        const r = sqlite.prepare(sql).run(...values);
        return { success: true, meta: { changes: Number(r.changes) } };
      },
    };
  }
  const sent: any[] = [];
  const env = {
    DB: {
      prepare,
      batch: async (queries: any[]) => {
        sqlite.exec("BEGIN");
        try {
          const values = [];
          for (const q of queries) values.push(await q.all());
          sqlite.exec("COMMIT");
          return values;
        } catch (e) {
          sqlite.exec("ROLLBACK");
          throw e;
        }
      },
    },
    EMAIL: {
      send: async (data: any) => {
        sent.push(data);
        return { messageId: "<provider-1@cloudflare.net>" };
      },
    },
    ADMIN_TOKEN: "test-admin-token-of-at-least-32-characters",
    AGENT_TOKEN: "local-agent-token-at-least-32-characters",
    SEND_ENABLED: "true",
    DISCOVERY_ENABLED: "false",
    FROM_EMAIL: "hello@everknitting.com",
    REPLY_EMAIL: "replies@reply.everknitting.com",
    PUBLIC_BASE_URL: "https://everknitting.com/api/outbound",
    DAILY_SEND_LIMIT: "10",
    DAILY_RESEARCH_LIMIT: "10",
  } as unknown as Environment;
  sqlite.exec(`INSERT INTO campaigns(id,name,icp,seller_facts,enabled) VALUES('c','Test','Knitwear brand','OEM',1);
  INSERT INTO leads(id,campaign_id,company,domain,email,contact_source,source_url,status,unsubscribe_token) VALUES('l','c','Brand','brand.example','buyer@brand.example','https://brand.example/contact','https://brand.example','qualified','11111111-1111-4111-8111-111111111111');
  INSERT INTO messages(id,lead_id,step,subject,body,due_at) VALUES('m','l',0,'Knitwear sourcing','Hello from Ever Knitting',0);`);
  const row = (table: string, id: string) =>
    sqlite.prepare(`SELECT * FROM ${table} WHERE id=?`).get(id) as any;
  const request = (path: string, data?: unknown) =>
    new Request(`https://worker.test${path}`, {
      method: data ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${env.ADMIN_TOKEN}`,
        "X-Outbound-Actor": "reviewer-1",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  const approve = () =>
    handle(
      request("/messages/approve", {
        id: "m",
        revision: 1,
        contact_verified: true,
        due_at: 0,
      }),
      env,
    );
  return { env, sqlite, sent, row, request, approve };
}
test("admin routes deny missing token and missing reviewer; health is public", async () => {
  const { env } = fixture();
  assert.equal((await handle(new Request("https://x/state"), env)).status, 401);
  assert.equal(
    (
      await handle(
        new Request("https://x/state", {
          headers: { Authorization: `Bearer ${env.ADMIN_TOKEN}` },
        }),
        env,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handle(new Request("https://x/health"), env)).status,
    200,
  );
});
test("drafts cannot send; approval is revision-bound and editing revokes it", async () => {
  const f = fixture();
  await deliver(f.env, "m");
  assert.equal(f.sent.length, 0);
  assert.equal((await f.approve()).status, 200);
  await handle(
    f.request("/messages/edit", {
      id: "m",
      revision: 1,
      subject: "New subject",
      body: "Changed content",
    }),
    f.env,
  );
  assert.equal(f.row("messages", "m").status, "draft");
  assert.equal(f.row("messages", "m").approved_by, null);
  assert.equal((await f.approve()).status, 409);
  await deliver(f.env, "m");
  assert.equal(f.sent.length, 0);
});
test("concurrent send attempts claim exactly once and append unsubscribe", async () => {
  const f = fixture();
  await f.approve();
  await Promise.all([deliver(f.env, "m"), deliver(f.env, "m")]);
  assert.equal(f.sent.length, 1);
  assert.match(
    f.sent[0].text,
    /Unsubscribe: https:\/\/everknitting.com\/api\/outbound\/unsubscribe\//,
  );
  assert.equal(
    f.sent[0].headers["List-Unsubscribe-Post"],
    "List-Unsubscribe=One-Click",
  );
  assert.equal(f.row("messages", "m").status, "sent");
  assert.equal(f.row("leads", "l").status, "contacted");
});
test("send switch and campaign pause block an approved send", async () => {
  const f = fixture();
  await f.approve();
  f.env.SEND_ENABLED = "false";
  await deliver(f.env, "m");
  f.env.SEND_ENABLED = "true";
  f.sqlite.exec("UPDATE campaigns SET enabled=0");
  await deliver(f.env, "m");
  assert.equal(f.sent.length, 0);
});
test("suppression cancels approved messages and prevents re-import", async () => {
  const f = fixture();
  await f.approve();
  await suppress(f.env, "buyer@brand.example", "unsubscribe");
  assert.equal(f.row("messages", "m").status, "cancelled");
  await deliver(f.env, "m");
  assert.equal(f.sent.length, 0);
  const res = await handle(
    f.request("/leads", {
      campaign_id: "c",
      company: "Other",
      domain: "other.example",
      email: "buyer@brand.example",
      source_url: "https://other.example",
      contact_source: "https://other.example/contact",
    }),
    f.env,
  );
  assert.equal(res.status, 409);
});
test("GET unsubscribe does not mutate; POST works without authentication and is idempotent", async () => {
  const f = fixture(),
    url = "https://x/unsubscribe/11111111-1111-4111-8111-111111111111";
  assert.equal((await handle(new Request(url), f.env)).status, 200);
  assert.equal(f.row("leads", "l").status, "qualified");
  await handle(new Request(url, { method: "POST" }), f.env);
  await handle(new Request(url, { method: "POST" }), f.env);
  assert.equal(f.row("leads", "l").status, "unsubscribed");
});
test("daily budget is atomic, bounded, and rejects invalid configuration", async () => {
  const f = fixture();
  const results = await Promise.all(
    Array.from({ length: 20 }, () => budget(f.env, "send", 3)),
  );
  assert.equal(results.filter(Boolean).length, 3);
  assert.equal(await budget(f.env, "ai", NaN), false);
});
test("ambiguous provider error is never automatically retried", async () => {
  const f = fixture();
  await f.approve();
  let calls = 0;
  f.env.EMAIL.send = async () => {
    calls++;
    throw new Error("network timeout");
  };
  await deliver(f.env, "m");
  await deliver(f.env, "m");
  assert.equal(calls, 1);
  assert.equal(f.row("messages", "m").status, "uncertain");
});
test("reply stores parsed plain text and stops pending sequence; duplicate delivery is deduplicated", async () => {
  const f = fixture();
  await f.approve();
  const raw =
    "From: Buyer <buyer@brand.example>\r\nTo: replies@reply.everknitting.com\r\nSubject: Interested\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nPlease send a catalogue.";
  const incoming = () =>
    ({
      from: "buyer@brand.example",
      to: "replies@reply.everknitting.com",
      raw: new Response(raw).body!,
      rawSize: raw.length,
      setReject: () => assert.fail("should accept"),
    }) as unknown as ForwardableEmailMessage;
  await receive(incoming(), f.env);
  await receive(incoming(), f.env);
  assert.equal(f.row("leads", "l").status, "replied");
  assert.equal(f.row("messages", "m").status, "cancelled");
  assert.equal(
    f.sqlite.prepare("SELECT count(*) AS n FROM inbound").get()!.n,
    1,
  );
});
test("reply opt-out creates durable suppression", async () => {
  const f = fixture();
  const raw =
    "From: buyer@brand.example\r\nSubject: Remove me\r\n\r\nPlease unsubscribe.";
  await receive(
    {
      from: "buyer@brand.example",
      to: "replies@reply.everknitting.com",
      raw: new Response(raw).body!,
      rawSize: raw.length,
      setReject: () => {},
    } as unknown as ForwardableEmailMessage,
    f.env,
  );
  assert.equal(f.row("leads", "l").status, "unsubscribed");
  assert.equal(
    f.sqlite.prepare("SELECT count(*) AS n FROM suppressions").get()!.n,
    1,
  );
});
test("follow-up is queued only after delay; reply blocks it", async () => {
  const f = fixture();
  f.sqlite.exec(
    `UPDATE messages SET status='sent',sent_at=${now() - 5 * 86400};UPDATE leads SET status='contacted';`,
  );
  await tick(f.env);
  assert.equal(
    f.sqlite
      .prepare("SELECT count(*) AS n FROM jobs WHERE kind='followup:1'")
      .get()!.n,
    1,
  );
  assert.equal(f.sent.length, 0);
  const second = fixture();
  second.sqlite.exec(
    `UPDATE messages SET status='sent',sent_at=${now() - 5 * 86400};UPDATE leads SET status='replied';`,
  );
  await tick(second.env);
  assert.equal(
    second.sqlite.prepare("SELECT count(*) AS n FROM jobs").get()!.n,
    0,
  );
});
test("old approval does not mark a newly claimed send uncertain", async () => {
  const f = fixture();
  f.sqlite.exec(
    `UPDATE messages SET status='sending',approved_at=${now() - 86400},sending_at=${now()}`,
  );
  await tick(f.env);
  assert.equal(f.row("messages", "m").status, "sending");
});
test("domain/email uniqueness and stopped-state trigger are enforced by SQLite", () => {
  const f = fixture();
  assert.throws(() =>
    f.sqlite.exec(
      "INSERT INTO leads(id,campaign_id,company,domain,source_url,unsubscribe_token) VALUES('dup','c','Brand','BRAND.EXAMPLE','https://brand.example','x')",
    ),
  );
  f.sqlite.exec("UPDATE leads SET status='paused'");
  assert.equal(f.row("messages", "m").status, "cancelled");
});
test("unsafe domains and oversized input are rejected", async () => {
  assert.equal(domainOf("https://www.Brand.example/a"), "brand.example");
  for (const u of [
    "http://brand.example",
    "https://127.0.0.1",
    "https://localhost",
    "https://user:pass@brand.example",
    "https://brand.example:8443",
  ])
    assert.throws(() => domainOf(u));

  await assert.rejects(readBounded(new Response("123456"), 5));
});
test("contact changes are blocked after approval", async () => {
  const f = fixture();
  await f.approve();
  assert.equal(
    (
      await handle(
        f.request("/leads/contact", {
          id: "l",
          email: "new@brand.example",
          contact_source: "https://brand.example/contact",
        }),
        f.env,
      )
    ).status,
    409,
  );
  assert.equal(f.row("leads", "l").email, "buyer@brand.example");
});
test("local agent credential cannot read CRM or approve messages", async () => {
  const f = fixture();
  const request = new Request("https://x/state", {
    headers: {
      Authorization: `Bearer ${f.env.AGENT_TOKEN}`,
      "X-Outbound-Actor": "agent",
    },
  });
  assert.equal((await handle(request, f.env)).status, 401);
  const approve = f.request("/messages/approve", {
    id: "m",
    revision: 1,
    contact_verified: true,
    due_at: 0,
  });
  approve.headers.set("Authorization", `Bearer ${f.env.AGENT_TOKEN}`);
  assert.equal((await handle(approve, f.env)).status, 401);
});
test("local discovery is lease-bound, deduplicates domains, and queues research", async () => {
  const f = fixture();
  f.sqlite.exec(
    "INSERT INTO jobs(id,kind,entity_id) VALUES('j','discover','c')",
  );
  const job: any = (await claim(f.env)).job;
  const result = {
    companies: [
      {
        company: "New Brand",
        domain: "newbrand.example",
        source_url: "https://newbrand.example/products",
        country: "UK",
      },
      {
        company: "Duplicate",
        domain: "brand.example",
        source_url: "https://brand.example",
        country: "UK",
      },
    ],
  };
  assert.equal(
    await complete(f.env, { id: job.id, lease_token: "forged", result }),
    false,
  );
  assert.equal(
    await complete(f.env, { id: job.id, lease_token: job.lease_token, result }),
    true,
  );
  assert.equal(f.sqlite.prepare("SELECT count(*) AS n FROM leads").get()!.n, 2);
  assert.equal(
    f.sqlite
      .prepare("SELECT count(*) AS n FROM jobs WHERE kind='research'")
      .get()!.n,
    1,
  );
  assert.equal(
    await complete(f.env, { id: job.id, lease_token: job.lease_token, result }),
    false,
  );
});
test("local research creates draft only; stop during research prevents draft creation", async () => {
  const f = fixture();
  f.sqlite.exec(
    "DELETE FROM messages;INSERT INTO jobs(id,kind,entity_id) VALUES('j','research','l')",
  );
  const job: any = (await claim(f.env)).job;
  const result = {
    score: 80,
    summary: "Official knitwear catalogue",
    reasons: ["Sells wool knitwear"],
    sources: ["https://brand.example/knitwear"],
    subject: "Knitwear sourcing",
    body: "Would you like to discuss knitwear sourcing?",
    email: null,
    contact_source: null,
  };
  await complete(f.env, { id: job.id, lease_token: job.lease_token, result });
  assert.equal(
    f.sqlite.prepare("SELECT status FROM messages").get()!.status,
    "draft",
  );
  assert.equal(f.sent.length, 0);
  const stopped = fixture();
  stopped.sqlite.exec(
    "DELETE FROM messages;INSERT INTO jobs(id,kind,entity_id) VALUES('j','research','l')",
  );
  const stoppedJob: any = (await claim(stopped.env)).job;
  await suppress(stopped.env, "buyer@brand.example", "unsubscribe");
  await complete(stopped.env, {
    id: "j",
    lease_token: stoppedJob.lease_token,
    result,
  });
  assert.equal(
    stopped.sqlite.prepare("SELECT count(*) AS n FROM messages").get()!.n,
    0,
  );
  assert.equal(stopped.row("leads", "l").status, "unsubscribed");
});
