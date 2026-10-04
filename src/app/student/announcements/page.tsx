import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentAnnouncementsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const announcements = await db.announcement.findMany({
    where: {
      status: "PUBLISHED",
      targets: {
        some: {
          OR: [
            { targetType: "ALL" },
            { targetType: "GROUP", groupId: student.groupId },
            { targetType: "INDIVIDUAL", studentId: payload.studentId }
          ]
        }
      }
    },
    orderBy: { publishedAt: "desc" }
  });

  // Filter out expired announcements
  const now = new Date();
  const validAnnouncements = announcements.filter(a => !a.expiresAt || new Date(a.expiresAt) > now);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Official dispatches and academy notices.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {validAnnouncements.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p className="text-slate-500">No active announcements at this time.</p>
          </div>
        ) : validAnnouncements.map(a => (
          <Card key={a.id} className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500"></div>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/20 pb-4 border-b border-slate-100 dark:border-slate-800/60 ml-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{a.title}</CardTitle>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 w-fit">
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : new Date(a.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 ml-1">
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                {a.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
