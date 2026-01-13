// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

// Note: This is a placeholder UI. Real data will come from the database later.
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-2">Welcome back. Here is your daily overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Leads" value="128" icon={<Users className="text-blue-500" />} trend="+12% from last month" />
        <KpiCard title="Active Quotations" value="23" icon={<FileText className="text-amber-500" />} trend="5 pending approval" />
        <KpiCard title="Samples Sent" value="45" icon={<CheckCircle className="text-emerald-500" />} trend="12 delivered this week" />
        <KpiCard title="Conversion Rate" value="3.2%" icon={<TrendingUp className="text-purple-500" />} trend="+0.4% improvement" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Placeholder */}
        <div className="col-span-4 border rounded-xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">New lead added: Global Fashion Co.</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  // Using a simplified card structure to avoid dependency issues if Shadcn Card isn't perfect setup
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-neutral-500">{title}</h3>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-neutral-500 mt-1">{trend}</p>
      </div>
    </div>
  );
}
