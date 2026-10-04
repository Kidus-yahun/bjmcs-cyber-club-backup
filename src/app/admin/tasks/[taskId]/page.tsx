import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReviewList from "./ReviewList";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TaskReviewPage({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId;

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      assignments: true
    }
  });

  if (!task) notFound();

  // Determine who was assigned
  const assignment = task.assignments[0];
  let studentIds: string[] = [];

  if (assignment) {
    if (assignment.targetType === 'ALL') {
      const all = await db.student.findMany({ where: { isActive: true }, select: { id: true } });
      studentIds = all.map(s => s.id);
    } else if (assignment.targetType === 'GROUP' && assignment.groupId) {
      const groupStudents = await db.student.findMany({ where: { groupId: assignment.groupId, isActive: true }, select: { id: true } });
      studentIds = groupStudents.map(s => s.id);
    } else if (assignment.targetType === 'INDIVIDUAL' && assignment.studentId) {
      studentIds = [assignment.studentId];
    }
  }

  // Get those students + their submissions
  const students = await db.student.findMany({
    where: { id: { in: studentIds } },
    include: {
      application: true,
      submissions: {
        where: { taskId: task.id },
        include: { score: true }
      }
    },
    orderBy: { application: { fullName: "asc" } }
  });

  const reviewData = students.map(s => {
    const sub = s.submissions[0];
    return {
      studentId: s.id,
      name: s.application.fullName,
      submission: sub ? {
        id: sub.id,
        status: sub.status,
        content: sub.content,
        link: sub.link,
        originalFileName: sub.originalFileName,
        fileUrl: sub.fileUrl,
        links: sub.links,
        studentNote: sub.studentNote,
        createdAt: sub.createdAt,
        submissionType: sub.submissionType,
        score: sub.score ? { points: sub.score.points, feedback: sub.score.feedback } : null
      } : null
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tasks" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-4">
          <span className="mr-1">&larr;</span> Back to Tasks
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Review Submissions: <span className="text-blue-600 dark:text-blue-500">{task.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                Assigned to {studentIds.length} students
              </span>
              <span>&middot;</span>
              <span className={cn(
                "inline-flex items-center gap-1.5",
                new Date(task.deadline) < new Date() ? "text-rose-600 dark:text-rose-400 font-semibold" : ""
              )}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Deadline: {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase inline-flex items-center",
              task.status === 'PUBLISHED' 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" 
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
            )}>
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <ReviewList reviewData={reviewData} task={task} />
      </div>
    </div>
  );
}
