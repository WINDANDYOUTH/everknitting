// app/components/sections/StartYourProjectSection.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { sendInquiry } from "@/app/actions/send-inquiry";
import { trackFormSubmission } from "@/components/analytics";

const MATERIALS = [
  "Cashmere",
  "Wool / Wool Blends",
  "Alpaca",
  "Mohair",
  "Custom / Not sure",
] as const;

type ActionState =
  | { ok: true; message: string }
  | { ok: false; message: string }
  | null;

export default function StartYourProjectSection() {
  // ✅ React 19 / Next 16: useActionState (NOT useFormState)
  const [state, formAction] = React.useActionState<ActionState, FormData>(
    sendInquiry,
    null
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  
  // Capture timestamp once on mount to avoid impure function during render
  const [timestamp] = React.useState(() => Date.now().toString());

  // Reset form on success & track results (only track successful submissions)
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      // ✅ Track SUCCESSFUL submission - this triggers 'generate_lead' for GA4
      trackFormSubmission({
        formName: "start_project_success",
        formLocation: "start_project_section",
      });
    }
    // Note: We don't track errors to avoid inflating event counts
  }, [state]);

  // Client-side rate limiting wrapper
  const handleSubmit = async (formData: FormData) => {
    const lastSubmit = localStorage.getItem("lastInquirySubmit");
    const now = Date.now();
    
    if (lastSubmit) {
      const elapsed = now - parseInt(lastSubmit, 10);
      // Prevent submissions within 30 seconds
      if (elapsed < 30000) {
        const waitSeconds = Math.ceil((30000 - elapsed) / 1000);
        alert(`Please wait ${waitSeconds} seconds before submitting again.`);
        return;
      }
    }

    localStorage.setItem("lastInquirySubmit", now.toString());
    return formAction(formData);
  };

  return (
    <section className="bg-navy text-cashmere" id="contact">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start Your Project
            </h2>

            <p className="mt-4 text-base leading-relaxed text-wool">
              Tell us what you want to make. We’ll respond in 12–24 hours with
              yarn suggestions, sampling plan, and a clear quote timeline.
            </p>

            <div className="mt-6 rounded-3xl border border-wool/35 bg-cashmere/5 p-6">
              <div className="text-sm font-semibold text-cashmere">
                What to include
              </div>
              <ul className="mt-4 space-y-2 text-sm text-wool">
                {[
                  "Reference images or tech pack",
                  "Composition (cashmere / wool / blends)",
                  "Gauge (1.5gg–16gg) or target thickness",
                  "Size range + measurement chart",
                  "Qty per color/size + target price",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-wool/35 bg-cashmere/5 p-6 sm:p-8">
              <form ref={formRef} action={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      name="name"
                      className={inputClass}
                      placeholder="Your name"
                      maxLength={100}
                    />
                  </Field>

                  <Field label="Email *">
                    <input
                      name="email"
                      type="email"
                      className={inputClass}
                      placeholder="name@company.com"
                      required
                      maxLength={200}
                    />
                  </Field>

                  <Field label="Company / Brand">
                    <input
                      name="company"
                      className={inputClass}
                      placeholder="Brand / company name"
                      maxLength={200}
                    />
                  </Field>

                  <Field label="Product Type">
                    <input
                      name="productType"
                      className={inputClass}
                      placeholder="Sweater / Cardigan / Polo..."
                      maxLength={200}
                    />
                  </Field>

                  <Field label="Material">
                    <select
                      name="material"
                      className={selectClass}
                      defaultValue="Cashmere"
                    >
                      {MATERIALS.map((m) => (
                        <option key={m} value={m} className="text-black">
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Gauge">
                    <input
                      name="gauge"
                      className={inputClass}
                      placeholder="e.g. 7gg / 12gg / not sure"
                      maxLength={100}
                    />
                  </Field>

                  <Field label="Quantity" className="sm:col-span-2">
                    <input
                      name="quantity"
                      className={inputClass}
                      placeholder="e.g. 300 pcs total, 3 colors, sizes S–XL"
                      maxLength={300}
                    />
                  </Field>

                  <Field label="Requirements / Message" className="sm:col-span-2">
                    <textarea
                      name="message"
                      className={textareaClass}
                      placeholder="Share reference links, target price, timeline, packaging needs, and any QC standards..."
                      maxLength={5000}
                    />
                  </Field>

                  {/* Honeypot field - hidden from users, bots will fill it */}
                  <input
                    type="text"
                    name="_website"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      opacity: 0,
                    }}
                    aria-hidden="true"
                  />

                  {/* Timestamp for server-side validation */}
                  <input
                    type="hidden"
                    name="_timestamp"
                    value={timestamp}
                  />
                </div>

                {/* Status message */}
                {state?.message && (
                  <div
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm",
                      state.ok
                        ? "border-copper/50 bg-cashmere/10 text-cashmere"
                        : "border-wool/50 bg-navy-deep/20 text-cashmere/90",
                    ].join(" ")}
                  >
                    {state.message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SubmitRainbow />
                  <a
                    href="#consultation"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-wool/50 bg-cashmere/5 px-6 text-sm font-semibold text-cashmere backdrop-blur transition hover:bg-cashmere/10"
                  >
                    Get Free Sample Consultation
                  </a>
                </div>

                <p className="text-xs text-cashmere/60">
                  By submitting, you agree we can contact you about your inquiry.
                  NDA available upon request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitRainbow() {
  const { pending } = useFormStatus();

  // If RainbowButton supports type/disabled props, this works:
  return (
    <RainbowButton
      type="submit"
      disabled={pending}
      className="h-12 px-6 text-sm font-semibold disabled:opacity-70"
    >
      {pending ? "Sending..." : "Send Inquiry"}
    </RainbowButton>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={["block", className].filter(Boolean).join(" ")}>
      <span className="mb-2 block text-sm font-medium text-cashmere/85">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl border border-wool/40 bg-navy-deep/20 px-4 text-sm text-cashmere placeholder:text-cashmere/40 outline-none transition focus:border-copper/60";
const selectClass =
  "h-11 w-full rounded-2xl border border-wool/40 bg-navy-deep/20 px-4 text-sm text-cashmere outline-none transition focus:border-copper/60";
const textareaClass =
  "h-32 w-full resize-none rounded-2xl border border-wool/40 bg-navy-deep/20 px-4 py-3 text-sm text-cashmere placeholder:text-cashmere/40 outline-none transition focus:border-copper/60";
