import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import CreateMaterialModal from "./_components/CreateMaterialModal";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const [materials, groups, students] = await Promise.all([
    db.learningMaterial.findMany({
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Learning Materials</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage learning resources and links.</p>
        </div>
        <CreateMaterialModal groups={groups} students={students} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {materials.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No materials found.</p>
          </div>
        ) : materials.map(mat => (
          <Card key={mat.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-200 flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500 mb-2">{mat.category}</div>
                  <CardTitle className="text-lg leading-tight">{mat.title}</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                    mat.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  )}>
                    {mat.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {mat.resourceType}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">{mat.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-md border border-slate-100 dark:border-slate-800">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span className="font-medium">Target:</span> 
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {mat.targets[0]?.targetType || "ALL"}
                    {mat.targets[0]?.targetType === 'GROUP' && ` (Group: ${mat.targets[0].groupId})`}
                    {mat.targets[0]?.targetType === 'INDIVIDUAL' && ` (Student: ${mat.targets[0].studentId})`}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-colors group"
                >
                  Access Resource 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
