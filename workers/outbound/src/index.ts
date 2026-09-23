import { z } from "zod";
import {
  campaignSchema,
  draftSchema,
  emailSchema,
  leadSchema,
  publicError,
  readBounded,
  text,
  urlSchema,
} from "./core";
import {
  audit,
  enqueue,
  now,
  stmt,
  suppress,
  uid,
  type Environment,
} from "./db";
import { receive } from "./delivery";
import { tick } from "./scheduler";
import { claim, complete } from "./agent";

const json = (value: unknown, status = 200) =>
  Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
async function body(request: Request) {
  return JSON.parse(await readBounded(new Response(request.body), 24000));
}
async function authorized(request: Request, token: string) {
  if (!token || token.length < 32) return false;
  const actual = request.headers.get("Authorization") || "";
  const digest = (s: string) =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  const a = new Uint8Array(await digest(actual)),
    b = new Uint8Array(await digest(`Bearer ${token}`));
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
export async function handle(
  request: Request,
  env: Environment,
): Promise<Response> {
  const url = new URL(request.url),
    path = url.pathname;
  if (path === "/health")
    return json({ service: "everknitting-outbound", ok: true });
  const unsubscribe = path.match(/^\/unsubscribe\/([a-f0-9-]{36})$/);
  if (unsubscribe) {
    const lead: any = await stmt(
      env,
      "SELECT id,email FROM leads WHERE unsubscribe_token=?",
      unsubscribe[1],
    ).first();
    if (!lead) return new Response("Link not found", { status: 404 });
    if (request.method === "POST") {
      if (lead.email) await suppress(env, lead.email, "unsubscribe");
      else
        await stmt(
          env,
          "UPDATE leads SET status='unsubscribed' WHERE id=?",
          lead.id,
        ).run();
      return new Response("You have been unsubscribed.", {
        headers: { "Cache-Control": "no-store" },
      });
    }
    if (request.method !== "GET")
      return new Response("Method not allowed", { status: 405 });
    // GET is confirmation-only so security scanners cannot unsubscribe recipients.
    return new Response(
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Unsubscribe | Ever Knitting</title><main><h1>Unsubscribe from Ever Knitting</h1><p>Stop future outreach emails.</p><form method="post"><button>Unsubscribe</button></form></main></html>',
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Content-Security-Policy":
            "default-src 'none'; form-action 'self'; frame-ancestors 'none'",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  }
  if (path.startsWith("/agent/")) {
    if (
      request.method !== "POST" ||
      !(await authorized(request, env.AGENT_TOKEN))
    )
      return json({ error: "Unauthorized" }, 401);
    if (path === "/agent/claim") return json(await claim(env));
    if (path === "/agent/complete")
      return (await complete(env, await body(request)))
        ? json({ ok: true })
        : json({ error: "Lease expired; result was not applied" }, 409);
    if (path === "/agent/fail") {
      const data = z
        .object({ id: text(64), lease_token: text(64), error: text(200) })
        .parse(await body(request));
      await stmt(
        env,
        "UPDATE jobs SET status='failed',error=?,lease_token=NULL WHERE id=? AND lease_token=? AND status='running'",
        data.error,
        data.id,
        data.lease_token,
      ).run();
      return json({ ok: true });
    }
    return json({ error: "Not found" }, 404);
  }
  if (!(await authorized(request, env.ADMIN_TOKEN)))
    return json({ error: "Unauthorized" }, 401);
  const actor = request.headers.get("X-Outbound-Actor")?.slice(0, 128);
  if (!actor) return json({ error: "Reviewer identity required" }, 403);
  if (path === "/state" && request.method === "GET") {
    const results = await env.DB.batch([
      stmt(env, "SELECT * FROM campaigns ORDER BY created_at DESC"),
      stmt(
        env,
        "SELECT id,campaign_id,company,domain,email,contact_source,source_url,country,score,research,status,notes,created_at FROM leads ORDER BY created_at DESC LIMIT 200",
      ),
      stmt(env, "SELECT * FROM messages ORDER BY created_at DESC LIMIT 200"),
      stmt(env, "SELECT * FROM inbound ORDER BY received_at DESC LIMIT 100"),
      stmt(env, "SELECT * FROM jobs ORDER BY updated_at DESC LIMIT 50"),
      stmt(env, "SELECT * FROM audit ORDER BY id DESC LIMIT 100"),
      stmt(env, "SELECT * FROM budgets WHERE day=date('now')"),
    ]);
    return json({
      campaigns: results[0].results,
      leads: results[1].results,
      messages: results[2].results,
      inbound: results[3].results,
      jobs: results[4].results,
      audit: results[5].results,
      budgets: results[6].results,
      config: {
        sendEnabled: env.SEND_ENABLED === "true",
        discoveryEnabled: env.DISCOVERY_ENABLED === "true",
        agentConfigured: Boolean(env.AGENT_TOKEN),
        from: env.FROM_EMAIL,
        replyTo: env.REPLY_EMAIL,
        dailySendLimit: env.DAILY_SEND_LIMIT,
      },
    });
  }
  if (request.method !== "POST") return json({ error: "Not found" }, 404);
  const input = await body(request);
  if (path === "/campaigns") {
    const data = campaignSchema.parse(input),
      id = uid();
    await stmt(
      env,
      "INSERT INTO campaigns(id,name,icp,seller_facts,enabled) VALUES(?,?,?,?,?)",
      id,
      data.name,
      data.icp,
      data.seller_facts,
      data.enabled ? 1 : 0,
    ).run();
    await audit(env, actor, "campaign_created", id);
    return json({ id }, 201);
  }
  if (path === "/campaigns/toggle") {
    const data = z.object({ id: text(64), enabled: z.boolean() }).parse(input);
    await stmt(
      env,
      "UPDATE campaigns SET enabled=? WHERE id=?",
      data.enabled ? 1 : 0,
      data.id,
    ).run();
    await audit(
      env,
      actor,
      data.enabled ? "campaign_enabled" : "campaign_paused",
      data.id,
    );
    return json({ ok: true });
  }
  if (path === "/leads") {
    const data = leadSchema.parse(input),
      id = uid();
    if (data.email && !data.contact_source)
      return json({ error: "Contact source required" }, 400);
    if (
      data.email &&
      (await stmt(
        env,
        "SELECT 1 FROM suppressions WHERE email=?",
        data.email,
      ).first())
    )
      return json({ error: "Contact is suppressed" }, 409);
    await stmt(
      env,
      "INSERT INTO leads(id,campaign_id,company,domain,email,contact_source,source_url,country,unsubscribe_token) VALUES(?,?,?,?,?,?,?,?,?)",
      id,
      data.campaign_id,
      data.company,
      data.domain,
      data.email,
      data.contact_source,
      data.source_url,
      data.country,
      uid(),
    ).run();
    await enqueue(env, "research", id);
    await audit(env, actor, "lead_added", id);
    return json({ id }, 201);
  }
  if (path === "/leads/contact") {
    const data = z
      .object({ id: text(64), email: emailSchema, contact_source: urlSchema })
      .parse(input);
    if (
      await stmt(
        env,
        "SELECT 1 FROM suppressions WHERE email=?",
        data.email,
      ).first()
    )
      return json({ error: "Contact is suppressed" }, 409);
    // Do not move an active/previously sent sequence to a different recipient.
    const updated = await stmt(
      env,
      `UPDATE leads SET email=?,contact_source=?,updated_at=unixepoch() WHERE id=? AND status IN ('new','qualified')
      AND NOT EXISTS(SELECT 1 FROM messages WHERE lead_id=leads.id AND status IN ('approved','sending','sent','uncertain')) RETURNING id`,
      data.email,
      data.contact_source,
      data.id,
    ).first();
    if (!updated)
      return json({ error: "Contact locked by sequence state" }, 409);
    await audit(env, actor, "contact_verified", data.id);
    return json({ ok: true });
  }
  if (path === "/leads/status") {
    const data = z
      .object({
        id: text(64),
        status: z.enum(["paused", "won", "lost", "unsubscribed", "bounced"]),
        notes: z.string().max(4000).default(""),
      })
      .parse(input);
    const lead: any = await stmt(
      env,
      "SELECT email FROM leads WHERE id=?",
      data.id,
    ).first();
    if (!lead) return json({ error: "Lead not found" }, 404);
    if (lead.email && ["unsubscribed", "bounced"].includes(data.status))
      await suppress(
        env,
        lead.email,
        data.status === "bounced" ? "bounce" : "manual_opt_out",
      );
    await stmt(
      env,
      "UPDATE leads SET status=?,notes=?,updated_at=unixepoch() WHERE id=?",
      data.status,
      data.notes,
      data.id,
    ).run();
    await audit(env, actor, "lead_status", data.id, data.status);
    return json({ ok: true });
  }
  if (path === "/jobs") {
    const data = z
      .object({ kind: z.enum(["discover", "research"]), id: text(64) })
      .parse(input);
    await enqueue(env, data.kind, data.id);
    await audit(env, actor, "job_queued", data.id, data.kind);
    return json({ ok: true }, 202);
  }
  if (path === "/messages/edit") {
    const data = draftSchema.extend({ id: text(64) }).parse(input);
    const updated = await stmt(
      env,
      "UPDATE messages SET subject=?,body=?,revision=revision+1,status='draft',approved_by=NULL,approved_at=NULL WHERE id=? AND revision=? AND status IN ('draft','approved') RETURNING id",
      data.subject,
      data.body,
      data.id,
      data.revision,
    ).first();
    if (!updated)
      return json(
        { error: "Draft changed or is already sending; reload" },
        409,
      );
    await audit(env, actor, "draft_edited", data.id);
    return json({ ok: true });
  }
  if (path === "/messages/approve") {
    const data = z
      .object({
        id: text(64),
        revision: z.number().int().positive(),
        contact_verified: z.literal(true),
        due_at: z.number().int().min(0),
      })
      .parse(input);
    const updated = await stmt(
      env,
      `UPDATE messages SET status='approved',approved_by=?,approved_at=?,due_at=? WHERE id=? AND revision=? AND status='draft'
      AND (step=0 OR EXISTS(SELECT 1 FROM messages p WHERE p.lead_id=messages.lead_id AND p.step=messages.step-1 AND p.status='sent'))
      AND EXISTS(SELECT 1 FROM leads l JOIN campaigns c ON c.id=l.campaign_id WHERE l.id=messages.lead_id AND c.enabled=1 AND l.status IN ('qualified','contacted') AND l.email IS NOT NULL AND l.contact_source IS NOT NULL AND NOT EXISTS(SELECT 1 FROM suppressions WHERE email=l.email)) RETURNING id`,
      actor,
      now(),
      Math.max(now(), data.due_at),
      data.id,
      data.revision,
    ).first();
    if (!updated)
      return json(
        {
          error:
            "Approval blocked: reload and check contact, campaign, suppression and draft state",
        },
        409,
      );
    await audit(
      env,
      actor,
      "draft_approved",
      data.id,
      `revision:${data.revision};contact_verified:true`,
    );
    return json({ ok: true });
  }
  if (path === "/messages/cancel") {
    const data = z.object({ id: text(64) }).parse(input);
    await stmt(
      env,
      "UPDATE messages SET status='cancelled' WHERE id=? AND status IN ('draft','approved')",
      data.id,
    ).run();
    await audit(env, actor, "message_cancelled", data.id);
    return json({ ok: true });
  }
  if (path === "/messages/reconcile") {
    const data = z
      .object({
        id: text(64),
        outcome: z.enum(["sent", "not_sent"]),
        provider_id: z.string().max(300),
        note: text(1000),
      })
      .parse(input);
    if (data.outcome === "sent" && !data.provider_id)
      return json({ error: "Provider message ID required" }, 400);
    // not_sent still requires fresh review; never re-approve automatically.
    await stmt(
      env,
      "UPDATE messages SET status=?,provider_id=?,sent_at=?,approved_by=NULL,approved_at=NULL,error=NULL WHERE id=? AND status='uncertain'",
      data.outcome === "sent" ? "sent" : "draft",
      data.provider_id || null,
      data.outcome === "sent" ? now() : null,
      data.id,
    ).run();
    if (data.outcome === "sent")
      await stmt(
        env,
        "UPDATE leads SET status='contacted' WHERE id=(SELECT lead_id FROM messages WHERE id=? AND status='sent') AND status='qualified'",
        data.id,
      ).run();
    await audit(
      env,
      actor,
      "send_reconciled",
      data.id,
      `${data.outcome}: ${data.note}`,
    );
    return json({ ok: true });
  }
  return json({ error: "Not found" }, 404);
}
export default {
  async fetch(request: Request, env: Environment) {
    try {
      return await handle(request, env);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "request_failed",
          type: error instanceof Error ? error.name : "unknown",
        }),
      );
      return json(
        { error: publicError(error) },
        error instanceof z.ZodError ? 400 : 500,
      );
    }
  },
  async scheduled(
    _event: ScheduledController,
    env: Environment,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(tick(env));
  },
  async email(message: ForwardableEmailMessage, env: Environment) {
    await receive(message, env);
  },
};
