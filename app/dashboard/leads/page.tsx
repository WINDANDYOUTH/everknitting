import { getLeads } from "@/app/actions/leads";
export const dynamic = "force-dynamic";

import Link from "next/link";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Leads</h1>
          <p className="text-neutral-500 mt-2">Manage your prospective clients and contacts.</p>
        </div>
        {/* TODO: Add ability to create new lead directly from UI */}
        <Link 
          href="/dashboard/leads/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          + Add New Lead
        </Link>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        {/* Filters Placeholder */}
        <div className="p-4 border-b bg-neutral-50 flex flex-wrap items-center gap-4">
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="border rounded px-3 py-2 text-sm w-full max-w-sm"
          />
          <select className="border rounded px-3 py-2 text-sm bg-white text-neutral-600">
             <option value="">All Statuses</option>
             <option value="NEW">New</option>
             <option value="CONTACTED">Contacted</option>
             <option value="QUALIFIED">Qualified</option>
          </select>
          <select className="border rounded px-3 py-2 text-sm bg-white text-neutral-600">
             <option value="">All Countries</option>
             {/* Dynamic countries needed later */}
          </select>
        </div>
        
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-100 text-neutral-600 font-medium border-b sticky top-0">
            <tr>
              <th className="py-3 px-4">Brand Name</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.length === 0 ? (
               <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-500">
                  No leads found. Add some in Supabase!
                </td>
               </tr>
            ) : (
              leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-neutral-50 group border-b last:border-0 transition-colors">
                  <td className="py-3 px-4 font-medium text-neutral-900">
                    <Link href={`/dashboard/leads/${lead.id}`} className="hover:text-emerald-600 hover:underline block w-full">
                       {lead.companyName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{lead.country || "-"}</td>
                  <td className="py-3 px-4 text-neutral-600">{lead.source || "-"}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={lead.priority} />
                  </td>
                  <td className="py-3 px-4 text-neutral-600 text-xs">
                     {lead.owner || "Unassigned"}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/dashboard/leads/${lead.id}`} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium border border-emerald-200 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        
        <div className="p-4 border-t text-center text-xs text-neutral-500">
          Showing {leads.length} leads
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-purple-100 text-purple-700",
    QUALIFIED: "bg-emerald-100 text-emerald-700",
    SAMPLE_SENT: "bg-amber-100 text-amber-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    WON: "bg-green-100 text-green-700",
    LOST: "bg-neutral-100 text-neutral-700",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 border-red-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    LOW: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${styles[priority] || "bg-gray-100 text-gray-700"}`}>
      {priority}
    </span>
  );
}
