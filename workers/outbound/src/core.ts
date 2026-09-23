import { z } from "zod";

export const text = (max = 1000) => z.string().trim().min(1).max(max);
export const emailSchema = z
  .email()
  .max(254)
  .transform((v) => v.trim().toLowerCase());
export function domainOf(input: string) {
  const u = new URL(input.includes("://") ? input : `https://${input}`);
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.port ||
    !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(host) ||
    /\.(local|internal|localhost)$/.test(host)
  )
    throw new Error("Public HTTPS domain required");
  return host;
}
export const urlSchema = z
  .url()
  .max(2000)
  .refine((v) => {
    try {
      domainOf(v);
      return true;
    } catch {
      return false;
    }
  }, "Public HTTPS URL required");
export const campaignSchema = z.object({
  name: text(120),
  icp: text(4000),
  seller_facts: text(4000),
  enabled: z.boolean().default(false),
});
export const leadSchema = z.object({
  campaign_id: text(64),
  company: text(200),
  domain: text(300).transform(domainOf),
  email: emailSchema.nullable().default(null),
  contact_source: urlSchema.nullable().default(null),
  source_url: urlSchema,
  country: z.string().max(100).default(""),
});
export const draftSchema = z.object({
  subject: text(180).refine((v) => !/[\r\n]/.test(v)),
  body: text(6000),
  revision: z.number().int().positive(),
});
export const candidateSchema = z.object({
  company: text(200),
  domain: text(300).transform(domainOf),
  source_url: urlSchema,
  country: z.string().max(100),
});
export const researchSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: text(4000),
  reasons: z.array(text(1000)).min(1).max(8),
  sources: z.array(urlSchema).min(1).max(8),
  subject: text(180).refine((v) => !/[\r\n]/.test(v)),
  body: text(6000),
});
export async function readBounded(
  response: Response,
  limit = 256_000,
): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Response too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(out);
}
export function publicError(error: unknown) {
  return error instanceof z.ZodError
    ? "Invalid input"
    : "Operation failed; check configuration or job status";
}
