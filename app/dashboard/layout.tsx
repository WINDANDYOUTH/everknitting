import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Users, Package, FileText, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-emerald-900">
            <span>Ever Knitting CRM</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarItem href="/dashboard/leads" icon={<Users size={20} />} label="Leads & Clients" />
          <SidebarItem href="/dashboard/samples" icon={<Package size={20} />} label="Sample Requests" />
          <SidebarItem href="/dashboard/quotations" icon={<FileText size={20} />} label="Quotations" />
        </nav>

        <div className="p-4 border-t">
          <SidebarItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
          <div className="mt-4 flex items-center justify-center py-2 bg-neutral-50 rounded-lg">
             <UserButton showName />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-6 md:hidden">
          <span className="font-bold">EverCRM</span>
          {/* Mobile menu trigger could go here */}
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
