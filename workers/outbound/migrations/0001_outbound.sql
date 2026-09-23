PRAGMA foreign_keys = ON;
CREATE TABLE campaigns (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, icp TEXT NOT NULL, seller_facts TEXT NOT NULL,
 enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 last_discovery_at INTEGER, created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE leads (
 id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL REFERENCES campaigns(id),
 company TEXT NOT NULL, domain TEXT NOT NULL UNIQUE COLLATE NOCASE,
 email TEXT UNIQUE COLLATE NOCASE, contact_source TEXT, source_url TEXT NOT NULL,
 country TEXT NOT NULL DEFAULT '', score INTEGER CHECK(score BETWEEN 0 AND 100),
 research TEXT, status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','qualified','rejected','contacted','replied','unsubscribed','bounced','paused','won','lost')),
 notes TEXT NOT NULL DEFAULT '', unsubscribe_token TEXT NOT NULL UNIQUE,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()), updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE messages (
 id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id),
 step INTEGER NOT NULL CHECK(step BETWEEN 0 AND 2), subject TEXT NOT NULL, body TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','sending','sent','cancelled','uncertain','failed')),
 revision INTEGER NOT NULL DEFAULT 1, approved_by TEXT, approved_at INTEGER,
 due_at INTEGER NOT NULL, sending_at INTEGER, sent_at INTEGER, provider_id TEXT, error TEXT,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()), UNIQUE(lead_id,step)
);
CREATE INDEX messages_due ON messages(status,due_at);
CREATE TABLE suppressions (email TEXT PRIMARY KEY COLLATE NOCASE, reason TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch()));
CREATE TABLE inbound (
 id TEXT PRIMARY KEY, dedupe_key TEXT NOT NULL UNIQUE, lead_id TEXT REFERENCES leads(id),
 sender TEXT NOT NULL, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
 received_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE audit (id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, action TEXT NOT NULL, entity_id TEXT, detail TEXT, created_at INTEGER NOT NULL DEFAULT (unixepoch()));
CREATE TABLE budgets (day TEXT NOT NULL, kind TEXT NOT NULL, used INTEGER NOT NULL, PRIMARY KEY(day,kind));
CREATE TABLE jobs (id TEXT PRIMARY KEY, kind TEXT NOT NULL, entity_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, lease_token TEXT, error TEXT, updated_at INTEGER NOT NULL DEFAULT (unixepoch()));
CREATE UNIQUE INDEX jobs_active ON jobs(kind,entity_id) WHERE status IN ('pending','running');
-- Suppression is durable across re-imports. Stop all queued messages atomically.
CREATE TRIGGER suppress_insert AFTER INSERT ON suppressions BEGIN
 UPDATE leads SET status=CASE WHEN NEW.reason='bounce' THEN 'bounced' ELSE 'unsubscribed' END,updated_at=unixepoch() WHERE email=NEW.email;
 UPDATE messages SET status='cancelled' WHERE lead_id IN (SELECT id FROM leads WHERE email=NEW.email) AND status IN ('draft','approved');
END;
CREATE TRIGGER lead_stop AFTER UPDATE OF status ON leads WHEN NEW.status IN ('replied','unsubscribed','bounced','paused','rejected','won','lost') BEGIN
 UPDATE messages SET status='cancelled' WHERE lead_id=NEW.id AND status IN ('draft','approved');
END;
