import PostalMime from "postal-mime";
import {
  audit,
  budget,
  now,
  stmt,
  suppress,
  uid,
  type Environment,
} from "./db";
import { readBounded } from "./core";

export async function deliver(env: Environment, id: string) {
  if (env.SEND_ENABLED !== "true") return;
  if (
    !/^https:\/\//.test(env.PUBLIC_BASE_URL) ||
    !env.FROM_EMAIL.endsWith("@everknitting.com") ||
    !env.REPLY_EMAIL.endsWith("@reply.everknitting.com")
  )
    throw new Error("Sending configuration invalid");
  // D1 compare-and-set is the arbiter across concurrent HTTP and Cron executions.
  const msg: any = await stmt(
    env,
    `UPDATE messages SET status='sending',sending_at=unixepoch() WHERE id=? AND status='approved' AND due_at<=?
    AND EXISTS(SELECT 1 FROM leads l JOIN campaigns c ON c.id=l.campaign_id WHERE l.id=messages.lead_id AND c.enabled=1
      AND l.status IN ('qualified','contacted') AND l.email IS NOT NULL AND l.contact_source IS NOT NULL
      AND NOT EXISTS(SELECT 1 FROM suppressions s WHERE s.email=l.email)) RETURNING *`,
    id,
    now(),
  ).first();
  if (!msg) return;
  if (!(await budget(env, "send", Number(env.DAILY_SEND_LIMIT)))) {
    await stmt(
      env,
      "UPDATE messages SET status='approved' WHERE id=? AND status='sending'",
      id,
    ).run();
    return;
  }
  const lead: any = await stmt(
    env,
    `SELECT * FROM leads WHERE id=? AND status IN ('qualified','contacted') AND NOT EXISTS(SELECT 1 FROM suppressions WHERE email=leads.email)`,
    msg.lead_id,
  ).first();
  if (!lead) {
    await stmt(
      env,
      "UPDATE messages SET status='cancelled' WHERE id=?",
      id,
    ).run();
    return;
  }
  const unsubscribe = `${env.PUBLIC_BASE_URL}/unsubscribe/${lead.unsubscribe_token}`;
  const prior: any = await stmt(
    env,
    "SELECT provider_id FROM messages WHERE lead_id=? AND status='sent' ORDER BY step DESC LIMIT 1",
    lead.id,
  ).first();
  const headers: Record<string, string> = {
    "List-Unsubscribe": `<${unsubscribe}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
  if (prior?.provider_id) {
    headers["In-Reply-To"] = prior.provider_id;
    headers.References = prior.provider_id;
  }
  try {
    const result = await env.EMAIL.send({
      from: { email: env.FROM_EMAIL, name: "Ever Knitting" },
      to: lead.email,
      replyTo: env.REPLY_EMAIL,
      subject: msg.subject,
      text: `${msg.body}\n\nEver Knitting | https://everknitting.com\nUnsubscribe: ${unsubscribe}`,
      headers,
    });
    await env.DB.batch([
      stmt(
        env,
        "UPDATE messages SET status='sent',provider_id=?,sent_at=? WHERE id=? AND status='sending'",
        result.messageId,
        now(),
        id,
      ),
      stmt(
        env,
        "UPDATE leads SET status='contacted',updated_at=unixepoch() WHERE id=? AND status='qualified'",
        lead.id,
      ),
    ]);
    await audit(env, "system", "email_sent", id);
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "unknown";
    // No blind retries: the provider may have accepted mail before a connection/DB failure.
    await stmt(
      env,
      "UPDATE messages SET status='uncertain',error=? WHERE id=? AND status='sending'",
      code,
      id,
    ).run();
    if (code === "E_RECIPIENT_SUPPRESSED" || code === "E_DELIVERY_FAILED")
      await suppress(env, lead.email, "bounce");
    await audit(env, "system", "send_needs_reconciliation", id, code);
  }
}

export async function receive(
  message: ForwardableEmailMessage,
  env: Environment,
) {
  if (message.to.toLowerCase() !== env.REPLY_EMAIL.toLowerCase()) {
    message.setReject("Unknown recipient");
    return;
  }
  if (message.rawSize > 256_000) {
    message.setReject("Reply exceeds 256KB; please resend without attachments");
    return;
  }
  const raw = await readBounded(new Response(message.raw), 256_000);
  const parsed = await PostalMime.parse(raw);
  const sender = message.from.trim().toLowerCase();
  // Match envelope sender, not a spoofable display-name or arbitrary subject token.
  const lead: any = await stmt(
    env,
    "SELECT * FROM leads WHERE email=?",
    sender,
  ).first();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${message.from}\n${message.to}\n${raw}`),
  );
  const dedupe = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const body = (
    parsed.text || "[No plain-text body; review original sender separately]"
  ).slice(0, 20000);
  const operations = [
    stmt(
      env,
      "INSERT OR IGNORE INTO inbound(id,dedupe_key,lead_id,sender,recipient,subject,body) VALUES(?,?,?,?,?,?,?)",
      uid(),
      dedupe,
      lead?.id ?? null,
      sender,
      message.to,
      (parsed.subject || "").slice(0, 500),
      body,
    ),
  ];
  if (lead)
    operations.push(
      stmt(
        env,
        "UPDATE leads SET status='replied',updated_at=unixepoch() WHERE id=? AND status IN ('new','qualified','contacted','paused')",
        lead.id,
      ),
    );
  await env.DB.batch(operations);
  // Any reply pauses the sequence. Explicit opt-out additionally survives re-imports.
  const freshText = `${parsed.subject || ""}\n${body.split(/\n(?:On .+wrote:|>)/)[0]}`;
  if (
    lead &&
    /\b(unsubscribe|remove me|stop emailing|do not contact|opt out)\b|退订|不要再联系/i.test(
      freshText,
    )
  )
    await suppress(env, sender, "reply_opt_out");
}
