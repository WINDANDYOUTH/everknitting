import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewLeadForm } from "@/components/dashboard/NewLeadForm";

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/leads" className="text-neutral-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add New Lead</h1>
          <p className="text-neutral-500 text-sm">Enter the details of the potential client.</p>
        </div>
      </div>

      <NewLeadForm />
    </div>
  );
}
