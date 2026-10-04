import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import CreateTaskModal from "./_components/CreateTaskModal";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  const tasks = await db.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } }, assignments: true }
  });

  const groups = await db.group.findMany({ orderBy: { name: "asc" } });
  const students = await db.student.findMany({ where: { isActive: true }, include: { application: true }, orderBy: { application: { fullName: "asc" } } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Tasks Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create tasks and review submissions.</p>
        </div>
        <CreateTaskModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No tasks found.</p>
          </div>
        ) : tasks.map(task => {
          const isOverdue = new Date(task.deadline) < new Date();
          
          return (
            <Card key={task.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{task.title}</h3>
                      <div className="flex gap-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide",
                          task.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        )}>
                          {task.status}
                        </span>
                        {isOverdue && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl line-clamp-2">{task.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {task.assignments[0]?.targetType || "UNASSIGNED"}
                      </span>
                      <span>&middot;</span>
                      <span className={cn(
                        "inline-flex items-center gap-1.5",
                        isOverdue ? "text-rose-600 dark:text-rose-400" : ""
                      )}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-1.5">
                        Late Submissions: {task.allowLateSubmissions ? <span className="text-emerald-600 dark:text-emerald-400">Allowed</span> : <span className="text-slate-400">No</span>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                    <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center min-w-[120px]">
                      <div className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-500 leading-none mb-1">{task._count.submissions}</div>
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Submissions</div>
                    </div>
                    <Link 
                      href={`/admin/tasks/${task.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Review <span className="ml-1.5">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
