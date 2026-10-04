import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentMaterialsPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    select: { groupId: true }
  });

  if (!student) redirect("/login");

  const materials = await db.learningMaterial.findMany({
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
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Intelligence Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Access your cybersecurity learning materials and classified resources.</p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-100 dark:border-purple-900/50">
          Resources: {materials.length}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No resources available</h3>
            <p className="text-slate-500 mt-1">Check back later for new learning materials.</p>
          </div>
        ) : materials.map(mat => (
          <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
            <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 group-hover:border-purple-500/50 dark:group-hover:border-purple-400/50 transition-all duration-300 h-full flex flex-col shadow-sm group-hover:shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-100 dark:border-purple-900/50">
                    {mat.category}
                  </div>
                  <span className="text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {mat.resourceType}
                  </span>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                  {mat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between relative z-10">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">{mat.description}</p>
                <div className="mt-auto flex items-center justify-between text-sm font-medium text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Access Link
                  </span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
