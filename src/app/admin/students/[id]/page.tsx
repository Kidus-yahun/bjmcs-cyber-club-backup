import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const studentId = (await params).id;

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      application: true,
      group: { include: { mentor: true } },
      academicRecord: true,
      attendances: { include: { session: true } },
      submissions: { include: { task: true, score: true } }
    }
  });

  if (!student) notFound();

  // Progress calculations
  const totalAttendances = student.attendances.length;
  const presentOrLate = student.attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
  const attendancePercentage = totalAttendances > 0 ? Math.round((presentOrLate / totalAttendances) * 100) : 0;

  const totalTasks = await db.task.count({ where: { status: "PUBLISHED" } });
  const submissionsCount = student.submissions.length;
  const gradedSubmissions = student.submissions.filter(s => s.status === "GRADED");
  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score?.points || 0), 0);
  const maxPossibleScoreSoFar = gradedSubmissions.length * 10; // assuming 10 pts per task
  const gradePercentage = maxPossibleScoreSoFar > 0 ? Math.round((totalScore / maxPossibleScoreSoFar) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/students" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-4">
          <span className="mr-1">&larr;</span> Back to Students
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{student.application.fullName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{student.email}</p>
          </div>
          <div className="text-left md:text-right">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase inline-block",
              student.isActive 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" 
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
            )}>
              {student.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
            <p className="text-xs text-slate-400 mt-2 font-mono">App Ref: {student.application.reference}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">Group</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{student.group?.name || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">Mentor</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{student.group?.mentor?.name || "None"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">Certificate Status</span>
              <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-medium">
                {student.academicRecord?.certificateState || "RESULTS_NOT_FINAL"}
              </span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-2">Attendance Progress</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${attendancePercentage}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-9 text-right">{attendancePercentage}%</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-2">Task Progress</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${totalTasks > 0 ? (submissionsCount/totalTasks)*100 : 0}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-16 text-right">{submissionsCount}/{totalTasks}</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mt-4 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">Current Grade Average</span>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "font-bold text-2xl tracking-tight",
                  gradePercentage >= 80 ? "text-emerald-600 dark:text-emerald-400" :
                  gradePercentage >= 60 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
                )}>{gradePercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Gender</span><span className="font-medium text-slate-900 dark:text-slate-100">{student.application.gender}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Age</span><span className="font-medium text-slate-900 dark:text-slate-100">{student.application.age}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Phone</span><span className="font-medium text-slate-900 dark:text-slate-100">{student.application.phone}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">School</span><span className="font-medium text-slate-900 dark:text-slate-100">Grade {student.application.grade} Section {student.application.section}</span></div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">Technical Background</h4>
                <div className="space-y-3">
                  <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Programming Experience</span><span className="font-medium text-slate-900 dark:text-slate-100">{student.application.programmingExp}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Languages</span><span className="font-medium text-slate-900 dark:text-slate-100">{student.application.programmingLangs.join(", ") || "None"}</span></div>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">Motivation</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100 dark:border-slate-800">
                  {student.application.motivationJoin}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {student.submissions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No submissions found.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {student.submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{sub.task.title}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase",
                              sub.status === "GRADED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" :
                              sub.status === "SUBMITTED" ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400" :
                              "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                            )}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {sub.score?.points != null ? (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{sub.score.points} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">pts</span></span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                            {new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
