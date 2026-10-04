import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { ApplicationStatus } from "@prisma/client";
import { Search, Filter, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; grade?: string }>;
}) {
  const { q, status, grade } = await searchParams;

  const where: any = {};

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as ApplicationStatus;
  }

  if (grade && grade !== "ALL") {
    where.grade = grade;
  }

  const applications = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reference: true,
      fullName: true,
      email: true,
      grade: true,
      section: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Applications Management</h1>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628] shadow-sm">
        <CardContent className="p-4">
          <form className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label htmlFor="q" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="q"
                  name="q"
                  type="text"
                  defaultValue={q || ""}
                  placeholder="Name, ref, or email..."
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 transition-colors shadow-sm"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 space-y-1.5">
              <label htmlFor="status" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={status || "ALL"}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 transition-colors shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SELECTED">Selected</option>
                <option value="NOT_SELECTED">Not Selected</option>
              </select>
            </div>
            
            <div className="w-full md:w-32 space-y-1.5">
              <label htmlFor="grade" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</label>
              <select
                id="grade"
                name="grade"
                defaultValue={grade || "ALL"}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 transition-colors shadow-sm"
              >
                <option value="ALL">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="submit"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
              <Link
                href="/admin/applications"
                className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-[#0f172a] rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800/50">
            <thead className="bg-slate-50 dark:bg-[#0a1628]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{app.fullName}</div>
                    <div className="text-sm text-slate-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 dark:text-slate-400">{app.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {app.grade}-{app.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border ${
                      app.status === 'SELECTED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                      app.status === 'NOT_SELECTED' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' :
                      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/applications/${app.id}`} 
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-800/50 transition-colors"
                    >
                      Review &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-medium text-slate-600 dark:text-slate-300">No applications found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
