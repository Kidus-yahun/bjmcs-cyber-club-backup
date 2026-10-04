import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import CreateGroupModal from "./_components/CreateGroupModal";
import CreateMentorModal from "./_components/CreateMentorModal";

export const dynamic = "force-dynamic";

export default async function AdminGroupsPage() {
  const [groups, mentors] = await Promise.all([
    db.group.findMany({
      include: { mentor: true, _count: { select: { students: true } } },
      orderBy: { name: "asc" }
    }),
    db.mentor.findMany({
      include: { groups: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Groups & Mentors</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organize cohorts and assign leadership.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateMentorModal />
          <CreateGroupModal mentors={mentors} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GROUPS */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cohorts / Groups</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {groups.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No groups defined.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mentor</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {groups.map(g => (
                      <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{g.name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {g.mentor ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {g.mentor.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                            {g._count.students}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MENTORS */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Mentors</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {mentors.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No mentors defined.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Assigned Groups</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {mentors.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{m.name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{m.email || <span className="text-slate-400 dark:text-slate-500 italic">-</span>}</td>
                        <td className="px-6 py-4 text-right">
                          {m.groups.length > 0 ? (
                            <div className="flex flex-wrap justify-end gap-1">
                              {m.groups.map(g => (
                                <span key={g.id} className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-500/20">
                                  {g.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic text-sm">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
