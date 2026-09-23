import { z } from "zod";
import {
  candidateSchema,
  domainOf,
  emailSchema,
  researchSchema,
  text,
  urlSchema,
} from "./core";
import { audit, budget, now, stmt, uid, type Environment } from "./db";

const resultSchema = researchSchema.extend({
  email: emailSchema.nullable(),
  contact_source: urlSchema.nullable(),
});
export async function claim(env: Environment) {
  const pending = await stmt(
    env,
    "SELECT 1 FROM jobs WHERE status='pending' LIMIT 1",
  ).first();
  if (
    !pending ||
    !(await budget(env, "research", Number(env.DAILY_RESEARCH_LIMIT)))
  )
    return { job: null };
  const job: any = await stmt(
    env,
    `UPDATE jobs SET status='running',lease_token=?,attempts=attempts+1,updated_at=?
    WHERE id=(SELECT id FROM jobs WHERE status='pending' ORDER BY updated_at LIMIT 1) AND status='pending' RETURNING *`,
    uid(),
    now(),
  ).first();
  if (!job) return { job: null };
  const lead: any =
    job.kind === "discover"
      ? null
      : await stmt(
          env,
          "SELECT id,campaign_id,company,domain,status FROM leads WHERE id=?",
          job.entity_id,
        ).first();
  const campaign: any = await stmt(
    env,
    "SELECT * FROM campaigns WHERE id=? AND enabled=1",
    job.kind === "discover" ? job.entity_id : lead?.campaign_id || "",
  ).first();
  if (
    !campaign ||
    (lead && !["new", "qualified", "contacted"].includes(lead.status))
  ) {
    await stmt(
      env,
      "UPDATE jobs SET status='cancelled',lease_token=NULL WHERE id=?",
      job.id,
    ).run();
    return { job: null };
  }
  const previous = lead
    ? await stmt(
        env,
        "SELECT subject,body FROM messages WHERE lead_id=? AND status='sent' ORDER BY step",
        lead.id,
      ).all()
    : { results: [] };
  const excluded = await stmt(
    env,
    "SELECT domain FROM leads ORDER BY created_at DESC LIMIT 500",
  ).all<{ domain: string }>();
  return {
    job,
    lead,
    campaign,
    previous: previous.results,
    exclude_domains: excluded.results.map((x) => x.domain),
  };
}
export async function complete(env: Environment, input: unknown) {
  const data = z
    .object({ id: text(64), lease_token: text(64), result: z.unknown() })
    .parse(input);
  const job: any = await stmt(
    env,
    "SELECT * FROM jobs WHERE id=? AND lease_token=? AND status='running' AND updated_at>?",
    data.id,
    data.lease_token,
    now() - 1800,
  ).first();
  if (!job) return false;
  const leaseSql =
    "EXISTS(SELECT 1 FROM jobs WHERE id=? AND lease_token=? AND status='running' AND updated_at>?)";
  const leaseArgs = [job.id, data.lease_token, now() - 1800];
  const operations: D1PreparedStatement[] = [];
  if (job.kind === "discover") {
    const result = z
      .object({ companies: z.array(candidateSchema).max(5) })
      .parse(data.result);
    for (const candidate of result.companies) {
      if (
        domainOf(candidate.source_url) !== candidate.domain ||
        candidate.domain === "everknitting.com"
      )
        continue;
      const id = uid();
      operations.push(
        stmt(
          env,
          `INSERT OR IGNORE INTO leads(id,campaign_id,company,domain,source_url,country,unsubscribe_token)
        SELECT ?,id,?,?,?,?,? FROM campaigns WHERE id=? AND enabled=1 AND ${leaseSql}`,
          id,
          candidate.company,
          candidate.domain,
          candidate.source_url,
          candidate.country,
          uid(),
          job.entity_id,
          ...leaseArgs,
        ),
      );
      operations.push(
        stmt(
          env,
          `INSERT OR IGNORE INTO jobs(id,kind,entity_id) SELECT ?,'research',id FROM leads WHERE id=? AND ${leaseSql}`,
          uid(),
          id,
          ...leaseArgs,
        ),
      );
    }
  } else {
    const result = resultSchema.parse(data.result);
    const lead: any = await stmt(
      env,
      "SELECT * FROM leads WHERE id=?",
      job.entity_id,
    ).first();
    if (!lead) return false;
    const step = job.kind.startsWith("followup:")
      ? Number(job.kind.split(":")[1])
      : 0;
    const live = `id=? AND status IN ('new','qualified','contacted') AND EXISTS(SELECT 1 FROM campaigns WHERE id=leads.campaign_id AND enabled=1) AND ${leaseSql}`;
    operations.push(
      stmt(
        env,
        `UPDATE leads SET research=?,score=?,status=CASE WHEN status='contacted' THEN status WHEN ?>=60 THEN 'qualified' ELSE 'rejected' END,updated_at=unixepoch() WHERE ${live}`,
        JSON.stringify({
          ...result,
          researched_at: now(),
          engine: "local-codex",
        }),
        result.score,
        result.score,
        lead.id,
        ...leaseArgs,
      ),
    );
    const publicContact =
      result.email &&
      result.contact_source &&
      result.sources.includes(result.contact_source) &&
      domainOf(result.contact_source) === lead.domain &&
      result.email.split("@")[1] === lead.domain;
    if (publicContact)
      operations.push(
        stmt(
          env,
          `UPDATE OR IGNORE leads SET email=?,contact_source=? WHERE email IS NULL AND ${live} AND NOT EXISTS(SELECT 1 FROM suppressions WHERE email=?)`,
          result.email,
          result.contact_source,
          lead.id,
          ...leaseArgs,
          result.email,
        ),
      );
    operations.push(
      stmt(
        env,
        `INSERT OR IGNORE INTO messages(id,lead_id,step,subject,body,due_at)
      SELECT ?,id,?,?,?,? FROM leads WHERE ${live} AND status IN ('qualified','contacted')`,
        uid(),
        step,
        result.subject,
        result.body,
        now(),
        lead.id,
        ...leaseArgs,
      ),
    );
  }
  operations.push(
    stmt(
      env,
      "UPDATE jobs SET status='done',lease_token=NULL,updated_at=? WHERE id=? AND lease_token=? AND status='running'",
      now(),
      job.id,
      data.lease_token,
    ),
  );
  await env.DB.batch(operations);
  await audit(env, "local-codex", "research_completed", job.id);
  return true;
}
