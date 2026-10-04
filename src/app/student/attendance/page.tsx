import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentAttendancePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const attendances = await db.attendance.findMany({
    where: { studentId: payload.studentId },
    include: { session: true },
    orderBy: { session: { date: "desc" } }
  });

  const total = attendances.length;
  const present = attendances.filter(a => a.status === "PRESENT").length;
  const late = attendances.filter(a => a.status === "LATE").length;
  const absent = attendances.filter(a => a.status === "ABSENT").length;
  const excused = attendances.filter(a => a.status === "EXCUSED").length;

  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0; 

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance Record</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Track your session presence and academy engagement metrics.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm text-center p-5 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-slate-800 dark:text-slate-200 font-mono mb-1">{total}</div>
          <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Sessions</div>
        </Card>
        <Card className="bg-white dark:bg-[#0f172a] border-emerald-100 dark:border-emerald-900/30 shadow-sm text-center p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500"></div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mb-1">{present}</div>
          <div className="text-[10px] font-bold tracking-widest text-emerald-600/70 dark:text-emerald-500/70 uppercase">Present</div>
        </Card>
        <Card className="bg-white dark:bg-[#0f172a] border-amber-100 dark:border-amber-900/30 shadow-sm text-center p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500"></div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mb-1">{late}</div>
          <div className="text-[10px] font-bold tracking-widest text-amber-600/70 dark:text-amber-500/70 uppercase">Late</div>
        </Card>
        <Card className="bg-white dark:bg-[#0f172a] border-rose-100 dark:border-rose-900/30 shadow-sm text-center p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500"></div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono mb-1">{absent}</div>
          <div className="text-[10px] font-bold tracking-widest text-rose-600/70 dark:text-rose-500/70 uppercase">Absent</div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md text-center p-5 flex flex-col items-center justify-center border-0">
          <div className="text-3xl font-black font-mono mb-1">{percentage}%</div>
          <div className="text-[10px] font-bold tracking-widest text-white/80 uppercase">Score</div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle className="text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Session Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {attendances.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-slate-500 text-lg font-medium">No records found.</p>
              <p className="text-sm text-slate-400 mt-1">Attendance data will appear here once logged.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500">Session</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {attendances.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(record.session.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{record.session.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        record.status === "PRESENT" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" :
                        record.status === "LATE" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" :
                        record.status === "EXCUSED" ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20" :
                        "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm max-w-[200px] truncate" title={record.notes || ""}>
                      {record.notes || <span className="opacity-50">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
