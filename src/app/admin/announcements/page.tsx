import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import CreateAnnouncementModal from "./_components/CreateAnnouncementModal";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const [announcements, groups, students] = await Promise.all([
    db.announcement.findMany({
      include: { targets: true },
      orderBy: { createdAt: "desc" }
    }),
    db.group.findMany({ orderBy: { name: "asc" } }),
    db.student.findMany({ where: { isActive: true }, include: { application: true }, orderBy: { application: { fullName: "asc" } } })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Announcements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Broadcast messages to students.</p>
        </div>
        <CreateAnnouncementModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No announcements found.</p>
          </div>
        ) : announcements.map(a => (
          <Card key={a.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl">{a.title}</CardTitle>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide shrink-0",
                  a.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                )}>
                  {a.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                  Target: <span className="text-slate-700 dark:text-slate-300 font-semibold">{a.targets[0]?.targetType || "ALL"}</span>
                  {a.targets[0]?.targetType === 'GROUP' && <span className="text-slate-600 dark:text-slate-400 font-normal"> (Group ID: {a.targets[0].groupId})</span>}
                  {a.targets[0]?.targetType === 'INDIVIDUAL' && <span className="text-slate-600 dark:text-slate-400 font-normal"> (Student ID: {a.targets[0].studentId})</span>}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Posted: {new Date(a.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {a.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
