import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import Link from "next/link";
import RegistrationControl from "./_components/RegistrationControl";
import { Users, Shield, Activity, Clock, ChevronRight, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalApps, pendingApps, selectedApps,
    activeStudents, groups, mentors,
    activeTasks, pendingSubmissions,
    recentAuditLogs, recentAnnouncements,
    registrationSettings
  ] = await Promise.all([
    db.application.count(),
    db.application.count({ where: { status: "PENDING" } }),
    db.application.count({ where: { status: "SELECTED" } }),
    
    db.student.count({ where: { isActive: true } }),
    db.group.count(),
    db.mentor.count(),
    
    db.task.count({ where: { status: "PUBLISHED" } }),
    db.submission.count({ where: { status: "SUBMITTED" } }), // SUBMITTED but not GRADED means pending review
    
    db.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 10 }),
    db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    
    db.registrationSettings.findUnique({ where: { id: "default" } })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Overview Dashboard</h1>
      
      <RegistrationControl isOpen={registrationSettings?.isOpen ?? false} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Core Stats */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-12 h-12 text-purple-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              Groups / Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {groups} <span className="text-lg text-slate-400 font-medium">/ {mentors}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-12 h-12 text-cyan-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeTasks}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-12 h-12 text-amber-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-blue-500" />
              Admissions Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total Applications</span>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{totalApps}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <span className="text-amber-800 dark:text-amber-400 font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Pending Review
                </span>
                <span className="font-bold text-lg text-amber-600 dark:text-amber-400">{pendingApps}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                <span className="text-green-800 dark:text-green-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Selected
                </span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">{selectedApps}</span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/admin/applications" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Manage Applications <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-cyan-500" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {recentAnnouncements.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
                  No announcements yet.
                </div>
              ) : recentAnnouncements.map(a => (
                <div key={a.id} className="group p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{a.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span className="uppercase tracking-wider font-medium text-slate-400">{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Link href="/admin/announcements" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Manage Announcements <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a1628]/50">
          <CardTitle className="text-lg">Administrative Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-[#0a1628] text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Timestamp</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Actor</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Action</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                      {log.actor}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {log.target || "-"}
                    </td>
                  </tr>
                ))}
                {recentAuditLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No recent activity.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
