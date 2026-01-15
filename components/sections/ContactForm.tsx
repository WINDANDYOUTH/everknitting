"use client";

import React, { useState, useRef } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendInquiry } from "@/app/actions/send-inquiry";
import { trackFormSubmission } from "@/components/analytics";
import { cn } from "@/lib/utils";

/**
 * ContactForm Component
 * 
 * Handles contact form submission with:
 * - Server Action integration (Resend)
 * - Anti-spam fields (honeypot + timestamp)
 * - Loading states
 * - Success/Error messaging
 * - Analytics tracking
 */
export function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setState(null);

    const formData = new FormData(event.currentTarget);

    // Track submission start
    trackFormSubmission({
      formName: "contact_us_main",
      formLocation: "contact_page",
    });

    try {
      const result = await sendInquiry(null, formData);
      setState(result);

      if (result.ok) {
        formRef.current?.reset();
        // Track successful submission
        trackFormSubmission({
          formName: "contact_us_main_success",
          formLocation: "contact_page",
        });
      } else {
        // Track failed submission
        trackFormSubmission({
          formName: "contact_us_main_error",
          formLocation: "contact_page",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setState({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setIsPending(false);
    }
  }

  // Timestamp for anti-spam (generated on mount)
  const [timestamp] = useState(Date.now());

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-navy">
      <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-spam hidden fields */}
        <input type="text" name="_website" className="hidden" tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="_timestamp" value={timestamp} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">Name</label>
            <input 
              required
              id="name"
              name="name"
              type="text" 
              className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" 
              placeholder="Jane Doe" 
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-semibold mb-2">Company</label>
            <input 
              id="company"
              name="company"
              type="text" 
              className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" 
              placeholder="Brand Co." 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
          <input 
            required
            id="email"
            name="email"
            type="email" 
            className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" 
            placeholder="jane@brand.com" 
          />
        </div>
        
        <div>
          <label htmlFor="productType" className="block text-sm font-semibold mb-2">Product Interest</label>
          <input 
            id="productType"
            name="productType"
            type="text" 
            className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition" 
            placeholder="e.g. Cashmere Sweaters" 
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-2">Message</label>
          <textarea 
            required
            id="message"
            name="message"
            className="w-full bg-gray-100 rounded-lg p-3 border-none focus:ring-2 focus:ring-copper outline-none transition h-32 resize-none" 
            placeholder="Tell us about your project (qty, timeline, materials)..."
          ></textarea>
        </div>

        {/* Status Message */}
        {state && (
          <div className={cn(
            "p-3 rounded-lg flex items-center gap-2 text-sm font-medium",
            state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {state.ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {state.message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg hover:bg-copper transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
