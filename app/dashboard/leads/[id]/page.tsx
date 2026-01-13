import { getLeadById } from "@/app/actions/lead-details";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { notFound } from "next/navigation";

export const runtime = 'edge';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  
  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Lead Header */}
      <div className="flex flex-col gap-4">
         <Link href="/dashboard/leads" className="text-neutral-400 hover:text-emerald-600 transition-colors inline-flex items-center gap-2 text-sm w-fit">
          <ArrowLeft size={16} /> Back to Leads
        </Link>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{lead.companyName}</h1>
              <div className="flex items-center gap-3 mt-3">
                 <Badge>{lead.status}</Badge>
                 <Badge variant="outline">Priority: {lead.priority}</Badge>
                 <span className="text-sm text-neutral-500">Owner: {lead.owner || "Unassigned"}</span>
              </div>
            </div>
            <div className="text-right">
              {/* Actions could go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Remarks */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Overview</h2>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-3">
                <dt className="text-neutral-500">Contact</dt>
                <dd className="col-span-2 font-medium">{lead.contactName || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-neutral-500">Email</dt>
                <dd className="col-span-2 font-medium break-all">{lead.email || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-neutral-500">Country</dt>
                <dd className="col-span-2 font-medium">{lead.country || "-"}</dd>
              </div>
               <div className="grid grid-cols-3">
                <dt className="text-neutral-500">Source</dt>
                <dd className="col-span-2 font-medium">{lead.source || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-neutral-500">Created</dt>
                <dd className="col-span-2 font-medium">{new Date(lead.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Remarks</h2>
                <button className="text-xs text-emerald-600 font-medium hover:underline">Edit</button>
             </div>
             <p className="text-sm text-neutral-600 whitespace-pre-wrap">
               {lead.notes || "No remarks added yet."}
             </p>
          </div>
        </div>

        {/* Right Column: Interactive Tabs */}
        <div className="lg:col-span-2 space-y-6">
           {/* Outreach Section */}
           <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b bg-neutral-50 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Outreach Log</h3>
                <button className="text-sm bg-white border border-neutral-300 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                   <Plus size={14} /> Log Activity
                </button>
             </div>
             <div className="divide-y">
                {leadingComment(lead.interactions, "No outreach activities logged yet.")}
                {lead.interactions.map((interaction: any) => (
                  <div key={interaction.id} className="p-4 hover:bg-neutral-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-neutral-900">{interaction.type}</span>
                      <span className="text-xs text-neutral-500">{new Date(interaction.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{interaction.notes}</p>
                    {interaction.channel && <div className="mt-2 text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded w-fit">{interaction.channel}</div>}
                  </div>
                ))}
             </div>
           </div>

           {/* Follow-ups Section */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b bg-neutral-50 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Follow-ups Timeline</h3>
                <button className="text-sm bg-white border border-neutral-300 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                   <Plus size={14} /> Add Follow-up
                </button>
             </div>
             <div className="p-6">
                <div className="relative border-l border-neutral-200 ml-3 space-y-8">
                  {lead.followUps.length === 0 && <p className="text-sm text-neutral-500 pl-6">No scheduled follow-ups.</p>}
                  {lead.followUps.map((fu: any) => (
                    <div key={fu.id} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{fu.stage}</span>
                        <p className="text-sm text-neutral-800">{fu.note}</p>
                        <span className="text-xs text-neutral-400">{new Date(fu.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>

           {/* Samples Section */}
           <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b bg-neutral-50 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Samples</h3>
                <button className="text-sm bg-white border border-neutral-300 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                   <Plus size={14} /> Request Sample
                </button>
             </div>
             <div className="p-4"> 
                {lead.samples.length === 0 ? (
                  <p className="text-sm text-neutral-500 text-center py-4">No samples requested.</p>
                ) : (
                  <div className="space-y-4">
                    {lead.samples.map((sample: any) => (
                      <div key={sample.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Tracking: {sample.trackingNumber || "Pending"}</div>
                          <div className="text-xs text-neutral-500 mt-1">Status: {sample.status} • Paid: {sample.isPaid ? "Yes" : "No"}</div>
                        </div>
                         <div className="text-right">
                           <div className="text-sm font-bold text-neutral-900">${sample.cost || "0.00"}</div>
                           <div className="text-xs text-neutral-500">Prob: {sample.probability}%</div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "outline" }) {
  const base = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  const styles = variant === "outline" ? "border border-neutral-200 text-neutral-600 bg-white" : "bg-emerald-100 text-emerald-800";
  return <span className={`${base} ${styles}`}>{children}</span>;
}

function leadingComment(arr: any[], msg: string) {
  if (arr.length === 0) return <div className="p-8 text-center text-sm text-neutral-500">{msg}</div>;
  return null;
}
