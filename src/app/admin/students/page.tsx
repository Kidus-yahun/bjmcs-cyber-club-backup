import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@/components/ui";
import Link from "next/link";
import AssignGroupSelect from "./_components/AssignGroupSelect";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const [students, groups] = await Promise.all([
    db.student.findMany({
      where: { isActive: true },
      include: {
        application: true,
        group: true
      },
      orderBy: { application: { fullName: "asc" } }
    }),
    db.group.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Active Students</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage enrolled student profiles and cohorts.</p>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cohort / Group</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{s.application.fullName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {s.id.slice(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.email}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px]">
                        <AssignGroupSelect 
                          studentId={s.id} 
                          currentGroupId={s.groupId} 
                          groups={groups} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/students/${s.id}`} 
                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all"
                      >
                        View Profile <span className="ml-1">&rarr;</span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No active students found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
