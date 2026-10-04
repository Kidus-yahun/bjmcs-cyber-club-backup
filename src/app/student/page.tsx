import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "STUDENT" || !payload.studentId) {
    redirect("/student/login");
  }

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: { 
      application: true,
      attendances: true,
      submissions: { include: { score: true } }
    }
  });

  if (!student) {
    redirect("/student/login");
  }

  // Calculate factual progress
  const publishedTasksCount = await db.task.count({ where: { status: "PUBLISHED" } });
  const publishedMaterialsCount = await db.learningMaterial.count({ where: { status: "PUBLISHED" } });
  
  const completedTasks = student.submissions.length;
  const attendanceCount = student.attendances.length;
  const presentCount = student.attendances.filter(a => a.status === "PRESENT").length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen text-slate-900 dark:text-slate-100">
      
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] text-white p-8 sm:p-10 border border-slate-800 shadow-lg">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Welcome back, <span className="text-cyan-400">{student.application.fullName}</span>
            </h1>
            <p className="text-slate-400 text-lg">BJMCS Cyber Club Academy Portal</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ID: {student.application.reference}
            </div>
            <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">
              Grade {student.application.grade} • Sec {student.application.section}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Status</h3>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Active</div>
            <p className="text-xs text-slate-500 mt-1 truncate">{student.email}</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Attendance</h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
            <div className="text-2xl font-bold">{presentCount} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {attendanceCount}</span></div>
            <Link href="/student/attendance" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2 inline-block font-medium">View history &rarr;</Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed Tasks</h3>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
            </div>
            <div className="text-2xl font-bold">{completedTasks} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {publishedTasksCount}</span></div>
            <Link href="/student/tasks" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mt-2 inline-block font-medium">Open tasks &rarr;</Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Learning Materials</h3>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
            </div>
            <div className="text-2xl font-bold">{publishedMaterialsCount} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">modules</span></div>
            <Link href="/student/materials" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mt-2 inline-block font-medium">Browse library &rarr;</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Recent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-slate-100 font-medium">Scores & Progress</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">Check your scored submissions inside the tasks view or final results engine.</p>
              </div>
              <Link href="/student/results" className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm shadow-blue-500/20">
                View Final Grades
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /></svg>
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-slate-100 font-medium">Stay Updated</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">Read the latest news and updates from the Cyber Club administration.</p>
              </div>
              <Link href="/student/announcements" className="px-4 py-2 mt-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-md transition-colors">
                Read Announcements
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
