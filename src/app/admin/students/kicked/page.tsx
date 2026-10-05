import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui";
import Link from "next/link";
import KickedStudentActions from "../KickedStudentActions";

export const dynamic = "force-dynamic";

export default async function KickedStudentsPage() {
  const students = await db.student.findMany({
    where: { kickedAt: { not: null } },
    include: { application: true },
    orderBy: { kickedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Kicked Students</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Deactivated student accounts and removal history.</p>
        </div>
        <Link href="/admin/students" className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Active Students</Link>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Username / Email</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date Kicked</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Reason</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{student.application.fullName}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{student.email}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{student.kickedAt?.toLocaleString() ?? "—"}</td>
                    <td className="max-w-xs whitespace-normal px-5 py-4 text-slate-600 dark:text-slate-300">{student.kickedReason || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">Kicked / Blocked</span>
                    </td>
                    <td className="px-5 py-4"><KickedStudentActions studentId={student.id} /></td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">No kicked students.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}