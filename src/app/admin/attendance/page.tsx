import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui";
import Link from "next/link";
import CreateSessionModal from "./_components/CreateSessionModal";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
  const sessions = await db.attendanceSession.findMany({
    orderBy: { date: "desc" },
    include: {
      group: true,
      _count: {
        select: { records: true }
      }
    }
  });

  const activeStudentsCount = await db.student.count({ where: { isActive: true } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Attendance Sessions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage daily attendance and history.</p>
        </div>
        <CreateSessionModal />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">No attendance sessions found.</p>
                    </td>
                  </tr>
                ) : sessions.map(s => {
                  const percentage = activeStudentsCount > 0 
                    ? Math.round((s._count.records / activeStudentsCount) * 100) 
                    : 0;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{s.title}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {s.group ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                            {s.group.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">All Students</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase inline-flex items-center",
                          s.status === 'OPEN' 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" 
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        )}>
                          {s.status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-8">{s._count.records}/{activeStudentsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/attendance/${s.id}`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all"
                        >
                          {s.status === 'OPEN' ? 'Take Attendance' : 'View Details'} <span className="ml-1">&rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
