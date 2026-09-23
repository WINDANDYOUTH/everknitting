export type Environment = Env & { ADMIN_TOKEN: string; AGENT_TOKEN: string };
export const now = () => Math.floor(Date.now() / 1000);
export const uid = () => crypto.randomUUID();
export function stmt(env: Environment, sql: string, ...values: unknown[]) {
  return env.DB.prepare(sql).bind(...values);
}
export async function audit(
  env: Environment,
  actor: string,
  action: string,
  id: string,
  detail = "",
) {
  await stmt(
    env,
    "INSERT INTO audit(actor,action,entity_id,detail) VALUES(?,?,?,?)",
    actor,
    action,
    id,
    detail,
  ).run();
}
export async function budget(env: Environment, kind: string, limit: number) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return false;
  const row = await stmt(
    env,
    `INSERT INTO budgets(day,kind,used) VALUES(date('now'),?,1)
    ON CONFLICT(day,kind) DO UPDATE SET used=used+1 WHERE used<? RETURNING used`,
    kind,
    limit,
  ).first();
  return Boolean(row);
}
export async function enqueue(env: Environment, kind: string, id: string) {
  await stmt(
    env,
    "INSERT OR IGNORE INTO jobs(id,kind,entity_id) VALUES(?,?,?)",
    uid(),
    kind,
    id,
  ).run();
}
export async function suppress(
  env: Environment,
  email: string,
  reason: string,
) {
  await env.DB.batch([
    stmt(
      env,
      "INSERT OR IGNORE INTO suppressions(email,reason) VALUES(?,?)",
      email,
      reason,
    ),
    stmt(
      env,
      "UPDATE leads SET status=?,updated_at=unixepoch() WHERE email=?",
      reason === "bounce" ? "bounced" : "unsubscribed",
      email,
    ),
  ]);
}
