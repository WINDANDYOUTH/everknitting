"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { createLead } from "@/app/actions/leads";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

/**
 * Submit Button with Loading State
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save size={16} />
          Save Lead
        </>
      )}
    </button>
  );
}

/**
 * New Lead Form with proper loading states and error handling
 */
export function NewLeadForm() {
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await createLead(formData);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to create lead. Please check your input.");
      }
    }
  }

  return (
    <form action={handleSubmit} className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="companyName" className="text-sm font-medium text-neutral-700">Company Name *</label>
          <input 
            name="companyName"
            id="companyName"
            required 
            placeholder="e.g. Fashion Brand Ltd."
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="contactName" className="text-sm font-medium text-neutral-700">Contact Person</label>
            <input 
              name="contactName"
              id="contactName"
              placeholder="e.g. Jane Doe"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</label>
            <input 
              name="email"
              id="email"
              type="email"
              placeholder="jane@example.com"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="country" className="text-sm font-medium text-neutral-700">Country</label>
            <input 
              name="country"
              id="country"
              placeholder="e.g. USA"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="source" className="text-sm font-medium text-neutral-700">Source</label>
            <input 
              name="source"
              id="source"
              placeholder="e.g. LinkedIn"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium text-neutral-700">Initial Status</label>
            <div className="relative">
              <select
                name="status"
                id="status"
                className="w-full px-3 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                defaultValue="NEW"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="SAMPLE_SENT">Sample Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-neutral-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium text-neutral-700">Priority</label>
            <div className="relative">
              <select
                name="priority"
                id="priority"
                className="w-full px-3 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                defaultValue="MEDIUM"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-neutral-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        
          <div className="grid gap-2">
            <label htmlFor="owner" className="text-sm font-medium text-neutral-700">Owner</label>
            <input 
              name="owner"
              id="owner"
              placeholder="Name"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end gap-3">
        <Link 
          href="/dashboard/leads"
          className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
