// Keep the existing UI convention: "MB" means 1024 * 1024 decoded file bytes.
// One file may use the entire allowance; five files must share the same total.
export const MAX_TOTAL_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_ATTACHMENT_SIZE = MAX_TOTAL_ATTACHMENT_SIZE;
export const MAX_ATTACHMENT_FILES = 5;
export const ATTACHMENT_LIMIT_LABEL = "10MB";

// 10 MiB becomes about 13.34 MiB of Base64. Leave room for JSON, other form
// fields and multipart framing. This is a transport allowance, not a file limit.
export const INQUIRY_ACTION_BODY_SIZE_LIMIT = 16 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const ALLOWED_ATTACHMENT_EXTENSIONS = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.gif";

export type InquiryAttachment = {
  filename: string;
  contentType: string;
  base64: string;
  size: number;
};

type AttachmentResult =
  | { ok: true; attachments: InquiryAttachment[] }
  | { ok: false; message: string };

const invalidAttachments = (): AttachmentResult => ({
  ok: false,
  message: "Could not read the attachments. Please remove them and upload the files again.",
});

const oversizedAttachments = (): AttachmentResult => ({
  ok: false,
  message: `Total attachment size exceeds ${ATTACHMENT_LIMIT_LABEL}. Please email larger files directly to info@everknitting.com`,
});

export function attachmentMetadataError(
  filename: string,
  contentType: string,
  size: number,
): string | null {
  if (!filename.trim() || filename.length > 255 || /[\u0000-\u001f\u007f/\\]/.test(filename)) {
    return "File name is invalid. Please rename the file and try again.";
  }
  if (!ALLOWED_ATTACHMENT_TYPES.includes(contentType)) {
    return "File type not supported.";
  }
  if (!Number.isSafeInteger(size) || size < 0) {
    return "File size is invalid. Please upload the file again.";
  }
  if (size > MAX_ATTACHMENT_SIZE) {
    return `File exceeds the ${ATTACHMENT_LIMIT_LABEL} limit.`;
  }
  return null;
}

// Validate canonical Base64 before computing its decoded length. Do not trust
// client-supplied sizes or use permissive Buffer decoding. No binary copy is
// allocated, keeping this usable in the Cloudflare Edge runtime.
function decodedBase64Size(base64: string): number | null {
  if (base64.length % 4 !== 0) return null;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const contentLength = base64.length - padding;
  if (/[^A-Za-z0-9+/]/.test(base64.slice(0, contentLength))) return null;
  if (padding) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const finalValue = alphabet.indexOf(base64[contentLength - 1]);
    // Unused bits in the final sextet must be zero (RFC 4648 section 3.5).
    if (finalValue < 0 || (finalValue & (padding === 2 ? 15 : 3)) !== 0) return null;
  }
  return (base64.length / 4) * 3 - padding;
}

/** Reject the whole inquiry on bad attachments; never silently send without them. */
export function parseInquiryAttachments(value: FormDataEntryValue | null): AttachmentResult {
  if (value === null || value === "") return { ok: true, attachments: [] };
  if (typeof value !== "string") return invalidAttachments();

  // Next 15.2.9 does not enforce bodySizeLimit for Edge actions. Bound our JSON
  // before parsing as well; this cannot limit the framework's earlier body read.
  if (value.length > INQUIRY_ACTION_BODY_SIZE_LIMIT) return oversizedAttachments();

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return invalidAttachments();
  }
  if (!Array.isArray(parsed)) return invalidAttachments();
  if (parsed.length > MAX_ATTACHMENT_FILES) {
    return { ok: false, message: `Maximum ${MAX_ATTACHMENT_FILES} files allowed.` };
  }

  const attachments: InquiryAttachment[] = [];
  let totalSize = 0;
  for (const item of parsed) {
    if (
      !item || typeof item !== "object" || Array.isArray(item) ||
      typeof item.filename !== "string" || typeof item.contentType !== "string" ||
      typeof item.base64 !== "string" || typeof item.size !== "number"
    ) return invalidAttachments();

    const metadataError = attachmentMetadataError(item.filename, item.contentType, item.size);
    if (metadataError) return { ok: false, message: metadataError };

    // Reject encoded oversize before scanning/decoding it, even if size is forged.
    if (item.base64.length > Math.ceil(MAX_ATTACHMENT_SIZE / 3) * 4) return oversizedAttachments();
    const decodedSize = decodedBase64Size(item.base64);
    if (decodedSize === null) return invalidAttachments();
    totalSize += decodedSize;
    if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) return oversizedAttachments();
    if (decodedSize !== item.size) return invalidAttachments();

    attachments.push({
      filename: item.filename,
      contentType: item.contentType,
      base64: item.base64,
      size: decodedSize,
    });
  }
  return { ok: true, attachments };
}
