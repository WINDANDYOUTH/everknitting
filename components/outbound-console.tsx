"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Campaign = { id: string; name: string; enabled: number; icp: string };
type Lead = {
  id: string;
  campaign_id: string;
  company: string;
  domain: string;
  email: string | null;
  contact_source: string | null;
  source_url: string;
  score: number | null;
  research: string | null;
  status: string;
  notes: string;
};
type Message = {
  id: string;
  lead_id: string;
  step: number;
  subject: string;
  body: string;
  status: string;
  revision: number;
  approved_by: string | null;
  due_at: number;
  error: string | null;
};
type State = {
  campaigns: Campaign[];
  leads: Lead[];
  messages: Message[];
  inbound: { id: string; sender: string; subject: string; body: string }[];
  jobs: { id: string; kind: string; status: string; error: string | null }[];
  config: {
    sendEnabled: boolean;
    discoveryEnabled: boolean;
    agentConfigured: boolean;
    from: string;
    replyTo: string;
    dailySendLimit: string;
  };
};
const field =
  "w-full rounded-lg border border-neutral-300 bg-white p-2 text-sm";
const button =
  "rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-40";
const secondary = "rounded-lg border px-3 py-2 text-sm disabled:opacity-40";
async function api(path: string, data?: unknown) {
  const res = await fetch(`/api/outbound/${path}`, {
    method: data ? "POST" : "GET",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}
function safeUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}
export default function OutboundConsole() {
  const [state, setState] = useState<State | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState("");
  const refresh = useCallback(async () => {
    setState(await api("state"));
  }, []);
  useEffect(() => {
    void refresh().catch((e) => setError(e.message));
  }, [refresh]);
  async function act(path: string, data: unknown) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(path, data);
      await refresh();
      setNotice("Saved. Queued work runs on the next scheduled cycle.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  const lead = state?.leads.find((x) => x.id === selected);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            EVER KNITTING / CRM
          </p>
          <h1 className="text-3xl font-semibold">AI Outbound</h1>
          <p className="mt-2 text-neutral-600">
            Discover → research → review → send. Every follow-up needs approval.
          </p>
        </div>
        <button
          className={secondary}
          disabled={busy}
          onClick={() => void refresh().catch((e) => setError(e.message))}
        >
          Refresh
        </button>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {!state ? (
        <p>
          Connect the OUTBOUND Worker binding and allowlist your Clerk user ID
          to load the console.
        </p>
      ) : (
        <>
          <section className="rounded-xl border bg-white p-4 text-sm">
            <strong>
              {state.config.sendEnabled ? "Sending enabled" : "Sending paused"}
            </strong>{" "}
            · {state.config.from} · {state.config.dailySendLimit}/day maximum
            <p className="mt-1 text-neutral-600">
              Local Codex:{" "}
              {state.config.agentConfigured
                ? "connected"
                : "agent token required"}{" "}
              · Daily discovery: {state.config.discoveryEnabled ? "on" : "off"}{" "}
              · Replies: {state.config.replyTo}
            </p>
          </section>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer font-medium">
              Create a prospecting campaign
            </summary>
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                void act("campaigns", {
                  name: d.get("name"),
                  icp: d.get("icp"),
                  seller_facts: d.get("facts"),
                  enabled: false,
                });
              }}
            >
              <label>
                Campaign name
                <input className={field} name="name" required maxLength={120} />
              </label>
              <label>
                Target customer / hard filters
                <textarea
                  className={field}
                  rows={3}
                  name="icp"
                  required
                  defaultValue="Independent fashion brands and private-label wholesalers selling cashmere or wool knitwear. Exclude manufacturers and marketplaces. Specify target countries before enabling."
                />
              </label>
              <label>
                Verified Ever Knitting facts for the email
                <textarea
                  className={field}
                  rows={3}
                  name="facts"
                  required
                  defaultValue="Ever Knitting provides OEM and ODM knitwear manufacturing for fashion brands, wholesalers and private-label companies. Website: https://everknitting.com. Ask whether the recipient would like to discuss knitwear sourcing. Do not claim specific MOQ, prices or certifications."
                />
              </label>
              <button className={button} disabled={busy}>
                Create paused campaign
              </button>
            </form>
          </details>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Campaigns</h2>
            {state.campaigns.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4"
              >
                <span className="flex-1">
                  <strong>{c.name}</strong>
                  <small className="block text-neutral-500">
                    {c.enabled ? "Active" : "Paused"} · {c.icp}
                  </small>
                </span>
                <button
                  className={secondary}
                  disabled={busy}
                  onClick={() =>
                    void act("campaigns/toggle", {
                      id: c.id,
                      enabled: !c.enabled,
                    })
                  }
                >
                  {c.enabled ? "Pause" : "Enable"}
                </button>
                <button
                  className={button}
                  disabled={busy || !c.enabled || !state.config.agentConfigured}
                  onClick={() =>
                    void act("jobs", { kind: "discover", id: c.id })
                  }
                >
                  Discover up to 5
                </button>
              </div>
            ))}
          </section>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer font-medium">
              Add a known company
            </summary>
            <form
              className="mt-4 grid gap-3 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                void act("leads", {
                  campaign_id: d.get("campaign"),
                  company: d.get("company"),
                  domain: d.get("domain"),
                  source_url: d.get("source"),
                  email: d.get("email") || null,
                  contact_source: d.get("contactSource") || null,
                  country: "",
                });
              }}
            >
              <label>
                Campaign
                <select name="campaign" className={field} required>
                  {state.campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Company
                <input className={field} name="company" required />
              </label>
              <label>
                Company domain
                <input
                  className={field}
                  name="domain"
                  placeholder="brand.com"
                  required
                />
              </label>
              <label>
                Evidence URL
                <input className={field} type="url" name="source" required />
              </label>
              <label>
                Public business email (optional)
                <input className={field} type="email" name="email" />
              </label>
              <label>
                Contact evidence URL
                <input className={field} type="url" name="contactSource" />
              </label>
              <button className={button} disabled={busy}>
                Add and queue research
              </button>
            </form>
          </details>
          <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">
                Leads{" "}
                <span className="text-neutral-400">{state.leads.length}</span>
              </h2>
              {!state.leads.length && (
                <p className="text-sm text-neutral-500">
                  Create a campaign, then discover or add companies.
                </p>
              )}
              {state.leads.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelected(l.id)}
                  className={`w-full rounded-xl border p-4 text-left ${l.id === selected ? "border-emerald-700 bg-emerald-50" : "bg-white"}`}
                >
                  <strong>{l.company}</strong>
                  <p className="text-sm text-neutral-500">{l.domain}</p>
                  <p className="mt-2 text-xs uppercase">
                    {l.status} · Fit {l.score ?? "—"}/100
                  </p>
                </button>
              ))}
            </section>
            <section className="space-y-4">
              {lead ? (
                <>
                  <div className="rounded-xl border bg-white p-5">
                    <h2 className="text-xl font-semibold">{lead.company}</h2>
                    <a
                      className="text-sm text-emerald-700 underline"
                      href={safeUrl(lead.source_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open company evidence ↗
                    </a>
                    <p className="mt-3 text-sm">
                      {lead.email || "No verified contact yet"}
                    </p>
                    {lead.contact_source && (
                      <a
                        className="text-sm underline"
                        href={safeUrl(lead.contact_source)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Verify contact source ↗
                      </a>
                    )}
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm">
                        Set public contact
                      </summary>
                      <form
                        className="mt-2 space-y-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const d = new FormData(e.currentTarget);
                          void act("leads/contact", {
                            id: lead.id,
                            email: d.get("email"),
                            contact_source: d.get("source"),
                          });
                        }}
                      >
                        <input
                          className={field}
                          aria-label="Contact email"
                          type="email"
                          name="email"
                          required
                          defaultValue={lead.email || ""}
                        />
                        <input
                          className={field}
                          aria-label="Contact evidence URL"
                          type="url"
                          name="source"
                          required
                          defaultValue={lead.contact_source || ""}
                        />
                        <button className={secondary} disabled={busy}>
                          Save contact
                        </button>
                      </form>
                    </details>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className={secondary}
                        disabled={busy || !state.config.agentConfigured}
                        onClick={() =>
                          void act("jobs", { kind: "research", id: lead.id })
                        }
                      >
                        Research
                      </button>
                      {(
                        [
                          "paused",
                          "won",
                          "lost",
                          "unsubscribed",
                          "bounced",
                        ] as const
                      ).map((status) => (
                        <button
                          key={status}
                          className={secondary}
                          disabled={busy}
                          onClick={() =>
                            void act("leads/status", {
                              id: lead.id,
                              status,
                              notes: lead.notes,
                            })
                          }
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    {lead.research && <Research value={lead.research} />}
                  </div>
                  {state.messages
                    .filter((m) => m.lead_id === lead.id)
                    .map((m) => (
                      <Draft
                        key={`${m.id}:${m.revision}:${m.status}`}
                        message={m}
                        busy={busy}
                        hasContact={Boolean(lead.email && lead.contact_source)}
                        act={act}
                      />
                    ))}
                </>
              ) : (
                <p className="p-6 text-neutral-500">
                  Choose a lead to review its research and email drafts.
                </p>
              )}
            </section>
          </div>
          <section className="rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Replies</h2>
            {!state.inbound.length && (
              <p className="mt-2 text-sm text-neutral-500">
                Incoming replies appear here and stop the matching sequence.
              </p>
            )}
            {state.inbound.map((m) => (
              <details key={m.id} className="mt-3 border-t pt-3">
                <summary>
                  {m.sender} · {m.subject}
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-sm">{m.body}</pre>
              </details>
            ))}
          </section>
          <details className="rounded-xl border bg-white p-5">
            <summary className="cursor-pointer font-medium">
              Job activity
            </summary>
            {state.jobs.map((j) => (
              <p key={j.id} className="mt-2 text-sm">
                {j.kind} · {j.status}
                {j.error ? ` · ${j.error}` : ""}
              </p>
            ))}
          </details>
        </>
      )}
    </div>
  );
}
function Research({ value }: { value: string }) {
  try {
    const r = JSON.parse(value);
    return (
      <details className="mt-4" open>
        <summary className="cursor-pointer font-medium">
          Research & evidence
        </summary>
        <p className="mt-2 whitespace-pre-wrap text-sm">{r.summary}</p>
        <ul className="my-2 list-inside list-disc text-sm">
          {r.reasons?.map((v: string) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        {r.sources?.map((v: string) => (
          <a
            className="block truncate text-sm text-emerald-700 underline"
            key={v}
            href={safeUrl(v)}
            target="_blank"
            rel="noreferrer"
          >
            {v}
          </a>
        ))}
        <p className="mt-2 text-xs text-neutral-500">
          AI fit assessment is an inference. Check sources and the contact
          before approving.
        </p>
      </details>
    );
  } catch {
    return <p>Research unavailable.</p>;
  }
}
function Draft({
  message: m,
  busy,
  hasContact,
  act,
}: {
  message: Message;
  busy: boolean;
  hasContact: boolean;
  act: (path: string, data: unknown) => Promise<void>;
}) {
  const [subject, setSubject] = useState(m.subject),
    [body, setBody] = useState(m.body),
    [verified, setVerified] = useState(false),
    [due, setDue] = useState("");
  const dirty = subject !== m.subject || body !== m.body,
    editable = ["draft", "approved"].includes(m.status);
  return (
    <article className="space-y-3 rounded-xl border bg-white p-5">
      <div className="flex justify-between">
        <h3 className="font-semibold">
          {m.step === 0 ? "First email" : `Follow-up ${m.step}`}
        </h3>
        <span className="text-sm uppercase text-neutral-500">{m.status}</span>
      </div>
      <label className="block text-sm">
        Subject
        <input
          className={field}
          value={subject}
          disabled={!editable}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={180}
        />
      </label>
      <label className="block text-sm">
        Email body
        <textarea
          className={field}
          rows={8}
          value={body}
          disabled={!editable}
          onChange={(e) => setBody(e.target.value)}
          maxLength={6000}
        />
      </label>
      <p className="text-xs text-neutral-500">
        The Ever Knitting footer and an unsubscribe link are appended
        automatically.
      </p>
      {editable && (
        <>
          <button
            className={secondary}
            disabled={busy || !dirty}
            onClick={() =>
              void act("messages/edit", {
                id: m.id,
                revision: m.revision,
                subject,
                body,
              })
            }
          >
            Save changes · review again
          </button>
          <label className="block text-sm">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />{" "}
            I verified the contact source, relevance, and this exact email.
          </label>
          <label className="block text-sm">
            Send after (local time; blank = next cycle)
            <input
              type="datetime-local"
              className={field}
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button
              className={button}
              disabled={
                busy ||
                dirty ||
                !verified ||
                !hasContact ||
                m.status !== "draft"
              }
              onClick={() =>
                void act("messages/approve", {
                  id: m.id,
                  revision: m.revision,
                  contact_verified: true,
                  due_at: due ? Math.floor(new Date(due).getTime() / 1000) : 0,
                })
              }
            >
              Approve for sending
            </button>
            <button
              className={secondary}
              disabled={busy}
              onClick={() => void act("messages/cancel", { id: m.id })}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {m.approved_by && <p className="text-xs">Approved by {m.approved_by}</p>}
      {m.error && <p className="text-sm text-red-700">{m.error}</p>}
      {m.status === "uncertain" && (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            void act("messages/reconcile", {
              id: m.id,
              outcome: d.get("outcome"),
              provider_id: d.get("provider"),
              note: d.get("note"),
            });
          }}
        >
          <p className="text-sm">
            Check Cloudflare Email Sending logs before resolving. Do not guess.
          </p>
          <select name="outcome" className={field}>
            <option value="sent">Provider confirms sent</option>
            <option value="not_sent">Provider confirms not sent</option>
          </select>
          <input
            className={field}
            name="provider"
            aria-label="Provider message ID"
            placeholder="Provider message ID (required if sent)"
          />
          <input
            className={field}
            name="note"
            aria-label="Reconciliation evidence"
            placeholder="Evidence from provider log"
            required
          />
          <button disabled={busy} className={secondary}>
            Record reconciliation
          </button>
        </form>
      )}
    </article>
  );
}
