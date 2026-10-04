import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentResultsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/student/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: {
      academicRecord: true,
      attendances: true,
      submissions: {
        include: { score: true }
      }
    }
  });

  if (!student) redirect("/student/login");

  // Calculate Attendance Score (20% max)
  const totalAtt = student.attendances.length;
  const presentAtt = student.attendances.filter(a => a.status === "PRESENT").length;
  const attendanceRatio = totalAtt > 0 ? presentAtt / totalAtt : 0;
  const attendancePoints = attendanceRatio * 20;

  // Mid Exam (30% max)
  const midExamPoints = student.academicRecord?.midExamScore != null ? (student.academicRecord.midExamScore / 100) * 30 : null;

  // Final Exam (50% max)
  const finalExamPoints = student.academicRecord?.finalExamScore != null ? (student.academicRecord.finalExamScore / 100) * 50 : null;

  // Continuous Assessment (Tasks)
  const scoredTasks = student.submissions.filter(s => s.score != null);
  const tasksAverage = scoredTasks.length > 0 
    ? scoredTasks.reduce((acc, curr) => acc + (curr.score?.points || 0), 0) / scoredTasks.length 
    : 0;

  const totalPoints = student.academicRecord?.isFinalized
    ? attendancePoints + (midExamPoints || 0) + (finalExamPoints || 0)
    : null;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen text-slate-900 dark:text-slate-100">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">Scores & Results Engine</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Final grade calculation and continuous assessment metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Final Result Panel */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <Card className={`flex-1 border-0 shadow-xl overflow-hidden relative ${
            student.academicRecord?.isFinalized 
              ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]' 
              : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 border'
          }`}>
            {student.academicRecord?.isFinalized && (
              <>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              </>
            )}
            
            <CardHeader className="text-center pb-0 pt-10 relative z-10">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 shadow-lg shadow-black/20 ring-1 ring-white/10">
                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <CardTitle className={`text-sm uppercase tracking-[0.2em] font-bold ${student.academicRecord?.isFinalized ? 'text-cyan-400' : 'text-slate-500'}`}>
                Final Result
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center pt-6 pb-12 flex-1 flex flex-col justify-center relative z-10">
              {student.academicRecord?.isFinalized ? (
                <div>
                  <div className="text-[6rem] leading-none font-black text-white tracking-tighter drop-shadow-md">
                    {totalPoints?.toFixed(1)}
                  </div>
                  <div className="inline-block mt-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-300 text-sm font-mono backdrop-blur-sm">
                    OUT OF 100 POINTS
                  </div>
                </div>
              ) : (
                <div className="px-6 py-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 mx-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Results Pending</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">Your final calculation will appear here once all grading periods are concluded and officially finalized.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Panel */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60">
              <CardTitle className="text-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Grading Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border-y sm:border sm:rounded-xl border-slate-100 dark:border-slate-800/60 overflow-hidden">
                
                {/* Attendance Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">Attendance</div>
                      <div className="text-sm text-slate-500 font-mono mt-0.5">{presentAtt} / {totalAtt} Days Present</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">20% Weight</div>
                    <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{attendancePoints.toFixed(1)}<span className="text-sm font-medium text-slate-400 ml-1">/ 20</span></div>
                  </div>
                </div>

                {/* Mid Exam Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">Mid Exam</div>
                      <div className="text-sm text-slate-500 font-mono mt-0.5">Raw Score: {student.academicRecord?.midExamScore ?? "-"} / 100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">30% Weight</div>
                    <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{midExamPoints != null ? midExamPoints.toFixed(1) : "-"}<span className="text-sm font-medium text-slate-400 ml-1">/ 30</span></div>
                  </div>
                </div>

                {/* Final Exam Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /></svg>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">Final Exam</div>
                      <div className="text-sm text-slate-500 font-mono mt-0.5">Raw Score: {student.academicRecord?.finalExamScore ?? "-"} / 100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">50% Weight</div>
                    <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{finalExamPoints != null ? finalExamPoints.toFixed(1) : "-"}<span className="text-sm font-medium text-slate-400 ml-1">/ 50</span></div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Continuous Assessments
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">Task scores support your learning journey and provide valuable feedback, though the final academic grade relies strictly on formal Exams and Attendance metrics.</p>
                </div>
                <div className="shrink-0 bg-black/30 px-6 py-4 rounded-xl border border-white/10 text-center min-w-[140px]">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Task Average</div>
                  <div className="text-3xl font-black text-cyan-400 font-mono">{tasksAverage.toFixed(1)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
