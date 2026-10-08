"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  ListTodo, 
  BookOpen, 
  Users, 
  UserPlus, 
  Megaphone,
  ShieldAlert,
  Menu,
  X,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Attendance", href: "/admin/attendance", icon: CheckSquare },
    { name: "Tasks & Submissions", href: "/admin/tasks", icon: ListTodo },
    { name: "Learning Materials", href: "/admin/materials", icon: BookOpen },
    { name: "Students & Cohort", href: "/admin/students", icon: Users },
    { name: "Kicked Students", href: "/admin/students/kicked", icon: ShieldAlert },
    { name: "Groups & Mentors", href: "/admin/groups", icon: UserPlus },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white z-20">
        <div className="font-bold text-lg">Admin Portal</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-72 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 border-r border-slate-800",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:block border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight text-white">Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">BGMCS CYBER CLUB</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                prefetch={false}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <form action={logoutAction}>
            <Button 
              type="submit" 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-3 justify-start px-3"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-0 h-[calc(100vh-60px)] md:h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
