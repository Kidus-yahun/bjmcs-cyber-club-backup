import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";
import SubmissionForm from "./SubmissionForm";

export const dynamic = "force-dynamic";

export default async function StudentTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId;
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const task = await db.task.findFirst({
    where: { 
      id: taskId, 
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
    include: {
      submissions: {
        where: { studentId: payload.studentId },
        include: { score: true }
      }
    }
  });

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-600/80 dark:text-red-400/80">Task not found, not assigned to you, or not currently published.</p>
          <Link href="/student/tasks" className="inline-block mt-6 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors">
            Return to Operations
          </Link>
        </div>
      </div>
    );
  }

  const submission = task.submissions[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-[#0a1628] min-h-screen">
      <Link href="/student/tasks" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mb-2">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Operations
      </Link>

      <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-cyan-400"></div>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800">OP-REQ</span>
                <span>{task.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{task.title}</CardTitle>
            </div>
            
            <div className="shrink-0 flex flex-col gap-2">
              <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Deadline</div>
                  <div className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                    {new Date(task.deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
              
              {task.attachmentUrl && (
                <a href={task.attachmentUrl} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-blue-500/70 uppercase">Resource</div>
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300">View Attachment</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Operation Briefing
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{task.description}</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Execution Instructions
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              {task.instructions}
            </div>
          </div>
        </CardContent>
      </Card>

      {submission?.score ? (
        <Card className="bg-emerald-50 dark:bg-[#0a2015] border-emerald-200 dark:border-emerald-900 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Evaluation Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-emerald-700 dark:text-emerald-400">{submission.score.points}</span>
              <span className="text-emerald-600/70 dark:text-emerald-500/70 font-bold uppercase tracking-widest pb-1.5">Points</span>
            </div>
            
            {submission.score.feedback && (
              <div className="bg-white/60 dark:bg-black/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                <div className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-500 uppercase mb-2">Instructor Feedback</div>
                <p className="text-emerald-900 dark:text-emerald-200 text-sm whitespace-pre-wrap leading-relaxed">{submission.score.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Task Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <SubmissionForm taskId={taskId} existingSubmission={submission} deadline={task.deadline} allowLate={task.allowLateSubmissions} />
        </CardContent>
      </Card>
    </div>
  );
}
