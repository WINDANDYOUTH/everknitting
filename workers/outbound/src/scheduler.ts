import { deliver } from "./delivery";
import { enqueue, now, stmt, type Environment } from "./db";

export async function tick(env: Environment) {
  // Crashed sends are never recycled; local research gets one retry after a 30-minute lease.
  await stmt(
    env,
    "UPDATE messages SET status='uncertain',error='Interrupted send; reconcile provider log' WHERE status='sending' AND sending_at<?",
    now() - 600,
  ).run();
  await stmt(
    env,
    "UPDATE jobs SET status=CASE WHEN attempts<2 THEN 'pending' ELSE 'failed' END,lease_token=NULL,error='Local agent lease expired' WHERE status='running' AND updated_at<?",
    now() - 1800,
  ).run();
  if (env.DISCOVERY_ENABLED === "true") {
    const campaigns = await stmt(
      env,
      "SELECT * FROM campaigns WHERE enabled=1 AND (last_discovery_at IS NULL OR last_discovery_at<?) LIMIT 1",
      now() - 86400,
    ).all<any>();
    for (const campaign of campaigns.results) {
      await enqueue(env, "discover", campaign.id);
      await stmt(
        env,
        "UPDATE campaigns SET last_discovery_at=? WHERE id=?",
        now(),
        campaign.id,
      ).run();
    }
  }
  const followups = await stmt(
    env,
    `SELECT l.id,m.step FROM leads l JOIN campaigns c ON c.id=l.campaign_id JOIN messages m ON m.lead_id=l.id
    WHERE c.enabled=1 AND l.status='contacted' AND m.status='sent' AND m.step<2
    AND m.sent_at <= ? - CASE WHEN m.step=0 THEN 4*86400 ELSE 7*86400 END
    AND NOT EXISTS(SELECT 1 FROM messages n WHERE n.lead_id=l.id AND n.step=m.step+1)
    AND NOT EXISTS(SELECT 1 FROM suppressions s WHERE s.email=l.email) LIMIT 5`,
    now(),
  ).all<any>();
  for (const lead of followups.results)
    await enqueue(env, `followup:${lead.step + 1}`, lead.id);
  const due = await stmt(
    env,
    "SELECT id FROM messages WHERE status='approved' AND due_at<=? ORDER BY due_at LIMIT 5",
    now(),
  ).all<{ id: string }>();
  for (const msg of due.results) await deliver(env, msg.id);
}
