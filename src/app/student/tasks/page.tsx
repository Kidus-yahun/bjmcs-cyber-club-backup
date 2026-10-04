import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentTasksPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const tasks = await db.task.findMany({
    where: { 
      status: "PUBLISHED",
      assignments: {
        some: {
          OR: [
            { targetType: "ALL" },
            { targetType: "GROUP", groupId: student.groupId },
            { targetType: "INDIVIDUAL", studentId: payload.studentId }
          ]
        }
      }
    },
    orderBy: { deadline: "asc" },
    include: {
      submissions: {
        where: { studentId: payload.studentId },
        include: { score: true }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Active Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your tasks, assignments, and cybersecurity challenges.</p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/50">
          Total Tasks: {tasks.length}
        </div>
      </div>
      
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No active operations</h3>
            <p className="text-slate-500 mt-1">You have no pending tasks or assignments at the moment.</p>
          </div>
        ) : tasks.map(task => {
          const submission = task.submissions[0];
          const isOverdue = !submission && new Date() > task.deadline;
          
          return (
            <Link key={task.id} href={`/student/tasks/${task.id}`} className="block group">
              <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50 dark:group-hover:border-cyan-500/50 transition-all duration-200 shadow-sm group-hover:shadow-md overflow-hidden relative">
                {/* Accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  submission ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-blue-500'
                }`} />
                
                <div className="p-5 sm:p-6 ml-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {task.title}
                      </h3>
                      {submission ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          {submission.status}
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 animate-pulse">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{task.description}</p>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2 text-sm shrink-0">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                      <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="font-mono">{new Date(task.deadline).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}</span>
                    </div>
                    {submission?.score && (
                      <div className="font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Score: {submission.score.points}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
