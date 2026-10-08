// app/actions/send-inquiry.ts
"use server";

import { Resend } from "resend";
import { renderInquiryEmailHTML } from "@/app/emails/inquiry-email";
import { parseInquiryAttachments } from "@/lib/inquiry-attachments";

export type ActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

function v(formData: FormData, key: string) {
  return (formData.get(key)?.toString() ?? "").trim();
}

// Anti-spam: Common spam keywords
const SPAM_KEYWORDS = [
  "viagra", "cialis", "casino", "lottery", "bitcoin", "crypto",
  "investment opportunity", "click here", "buy now", "limited time",
  "act now", "free money", "make money fast", "work from home",
  "weight loss", "pills", "pharmacy", "replica", "rolex"
];

// Anti-spam: Check for excessive URLs
function countUrls(text: string): number {
  const urlPattern = /(https?:\/\/|www\.)/gi;
  return (text.match(urlPattern) || []).length;
}

// Anti-spam: Check for spam content
function containsSpam(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lower.includes(keyword));
}

export async function sendInquiry(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1️⃣ HONEYPOT CHECK - Bots will fill this hidden field
    const honeypot = v(formData, "_website");
    if (honeypot) {
      // Silent fail - don't let bots know they were caught
      console.warn("🚫 Spam detected: honeypot field filled");
      return { ok: false, message: "Please try again later." };
    }

    // 2️⃣ TIMESTAMP CHECK - Prevent too-fast submissions (bots) and too-old forms
    const timestampStr = v(formData, "_timestamp");
    if (timestampStr) {
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const elapsed = now - timestamp;
      
      // Must take at least 2 seconds to fill form (human check)
      if (elapsed < 2000) {
        console.warn("🚫 Spam detected: form submitted too quickly");
        return { ok: false, message: "Please take your time filling the form." };
      }
      
      // Form must be submitted within 1 hour (prevent replay attacks)
      if (elapsed > 3600000) {
        console.warn("🚫 Spam detected: form expired");
        return { ok: false, message: "Form expired. Please refresh and try again." };
      }
    }

    const name = v(formData, "name");
    const email = v(formData, "email");
    const company = v(formData, "company");
    const productType = v(formData, "productType");
    const material = v(formData, "material");
    const gauge = v(formData, "gauge");
    const quantity = v(formData, "quantity");
    const message = v(formData, "message");

    // 3️⃣ BASIC VALIDATION
    if (!email || !email.includes("@")) {
      return { ok: false, message: "Please enter a valid email." };
    }
    if (!productType && !message) {
      return { ok: false, message: "Please add Product Type or a Message." };
    }

    // 4️⃣ SPAM CONTENT CHECK
    const allText = `${name} ${email} ${company} ${productType} ${message}`;
    
    if (containsSpam(allText)) {
      console.warn("🚫 Spam detected: spam keywords found");
      return { ok: false, message: "Your message contains prohibited content." };
    }

    // 5️⃣ URL SPAM CHECK - Max 3 URLs allowed
    if (countUrls(allText) > 3) {
      console.warn("🚫 Spam detected: too many URLs");
      return { ok: false, message: "Please limit URLs in your message." };
    }

    // 6️⃣ MESSAGE LENGTH CHECK
    if (message.length > 5000) {
      return { ok: false, message: "Message is too long. Please keep it under 5000 characters." };
    }

    // 7️⃣ EMAIL VALIDATION - Basic pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return { ok: false, message: "Please enter a valid email address." };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.INQUIRY_TO;

    if (!apiKey) return { ok: false, message: "RESEND_API_KEY is missing." };
    if (!from) return { ok: false, message: "RESEND_FROM is missing." };
    if (!to) return { ok: false, message: "INQUIRY_TO is missing." };

    const resend = new Resend(apiKey);

    const subject = `Start Your Project — ${company || name || "New Inquiry"}`;

    const html = renderInquiryEmailHTML({
      name,
      email,
      company,
      productType,
      material,
      gauge,
      quantity,
      message,
    });

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      replyTo: email,
    });

    if (error) {
      return { ok: false, message: `Failed to send: ${error.message}` };
    }

    return { ok: true, message: "Sent! We'll reply in 12–24 hours." };
  } catch (e: unknown) {
    console.error("❌ Send inquiry error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unexpected error.";
    return { ok: false, message: errorMessage };
  }
}

// ============================================================================
// SEND INQUIRY WITH ATTACHMENTS
// ============================================================================

/**
 * Enhanced inquiry submission with file attachments
 * Files are sent as Base64-encoded data and attached to the email via Resend
 */
export async function sendInquiryWithAttachments(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1️⃣ HONEYPOT CHECK
    const honeypot = v(formData, "_website");
    if (honeypot) {
      console.warn("🚫 Spam detected: honeypot field filled");
      return { ok: false, message: "Please try again later." };
    }

    // 2️⃣ TIMESTAMP CHECK
    const timestampStr = v(formData, "_timestamp");
    if (timestampStr) {
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const elapsed = now - timestamp;
      
      if (elapsed < 2000) {
        console.warn("🚫 Spam detected: form submitted too quickly");
        return { ok: false, message: "Please take your time filling the form." };
      }
      
      if (elapsed > 3600000) {
        console.warn("🚫 Spam detected: form expired");
        return { ok: false, message: "Form expired. Please refresh and try again." };
      }
    }

    // 3️⃣ EXTRACT FORM FIELDS
    const name = v(formData, "name");
    const email = v(formData, "email");
    const company = v(formData, "company");
    const productType = v(formData, "productType");
    const material = v(formData, "material");
    const gauge = v(formData, "gauge");
    const quantity = v(formData, "quantity");
    const message = v(formData, "message");

    // 4️⃣ BASIC VALIDATION
    if (!email || !email.includes("@")) {
      return { ok: false, message: "Please enter a valid email." };
    }
    if (!productType && !message) {
      return { ok: false, message: "Please add Product Type or a Message." };
    }

    // 5️⃣ SPAM CONTENT CHECK
    const allText = `${name} ${email} ${company} ${productType} ${message}`;
    
    if (containsSpam(allText)) {
      console.warn("🚫 Spam detected: spam keywords found");
      return { ok: false, message: "Your message contains prohibited content." };
    }

    if (countUrls(allText) > 3) {
      console.warn("🚫 Spam detected: too many URLs");
      return { ok: false, message: "Please limit URLs in your message." };
    }

    if (message.length > 5000) {
      return { ok: false, message: "Message is too long. Please keep it under 5000 characters." };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return { ok: false, message: "Please enter a valid email address." };
    }

    // 6️⃣ VALIDATE ATTACHMENTS - use decoded bytes, never client size claims.
    const attachmentResult = parseInquiryAttachments(formData.get("attachments"));
    if (!attachmentResult.ok) return attachmentResult;
    const attachments = attachmentResult.attachments;

    // 7️⃣ PREPARE EMAIL
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.INQUIRY_TO;

    if (!apiKey) return { ok: false, message: "Email configuration error. Please email info@everknitting.com directly." };
    if (!from) return { ok: false, message: "Email configuration error. Please email info@everknitting.com directly." };
    if (!to) return { ok: false, message: "Email configuration error. Please email info@everknitting.com directly." };

    const resend = new Resend(apiKey);

    const attachmentCount = attachments.length;
    const subject = `Start Your Project — ${company || name || "New Inquiry"}${attachmentCount > 0 ? ` (${attachmentCount} file${attachmentCount > 1 ? 's' : ''})` : ''}`;

    const html = renderInquiryEmailHTML({
      name,
      email,
      company,
      productType,
      material,
      gauge,
      quantity,
      message,
      attachmentCount, // Pass attachment count to email template
    });

    // 8️⃣ PREPARE RESEND ATTACHMENTS
    const resendAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.base64, // Resend accepts Base64 strings directly
    }));

    // 9️⃣ SEND EMAIL
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      replyTo: email,
      ...(resendAttachments.length > 0 && { attachments: resendAttachments }),
    });

    if (error) {
      console.error("❌ Resend error:", error);
      // Check if it's a size-related error
      if (error.message?.toLowerCase().includes("size") || error.message?.toLowerCase().includes("large")) {
        return { 
          ok: false, 
          message: "Files too large for email. Please send them directly to info@everknitting.com" 
        };
      }
      return { ok: false, message: `Failed to send. Please email info@everknitting.com directly.` };
    }

    const successMessage = attachmentCount > 0 
      ? `Sent with ${attachmentCount} file${attachmentCount > 1 ? 's' : ''}! We'll reply in 12–24 hours.`
      : "Sent! We'll reply in 12–24 hours.";

    return { ok: true, message: successMessage };
  } catch (e: unknown) {
    console.error("❌ Send inquiry with attachments error:", e);
    return { 
      ok: false, 
      message: "Something went wrong. Please email info@everknitting.com directly with your inquiry." 
    };
  }
}
