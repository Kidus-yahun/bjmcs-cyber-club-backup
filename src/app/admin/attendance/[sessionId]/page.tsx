import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AttendanceList from "./AttendanceList";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAttendanceSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const sessionId = (await params).sessionId;

  const session = await db.attendanceSession.findUnique({
    where: { id: sessionId },
    include: { group: true }
  });

  if (!session) {
    notFound();
  }

  // Fetch all active students
  const whereClause = { isActive: true, ...(session.groupId ? { groupId: session.groupId } : {}) };
  const students = await db.student.findMany({
    where: whereClause,
    include: {
      application: true,
      attendances: {
        where: { sessionId: session.id }
      }
    },
    orderBy: {
      application: { fullName: "asc" }
    }
  });

  // Map to a usable format for the client component
  const attendanceData = students.map(student => {
    const record = student.attendances[0];
    return {
      studentId: student.id,
      name: student.application.fullName,
      status: record?.status || null,
      notes: record?.notes || ""
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link href="/admin/attendance" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-4">
          <span className="mr-1">&larr;</span> Back to Sessions
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{session.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>&middot;</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {session.group?.name || "All Students"}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase inline-flex items-center",
              session.status === 'OPEN' 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" 
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
            )}>
              {session.status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
              {session.status}
            </span>
            <p className="text-xs text-slate-400 mt-2 font-mono">ID: {session.id.split('-')[0]}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-1">
        <AttendanceList sessionId={session.id} initialData={attendanceData} sessionStatus={session.status} />
      </div>
    </div>
  );
}
