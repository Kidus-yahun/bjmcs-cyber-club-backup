import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import ChangePasswordForm from "./ChangePasswordForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: {
      application: true,
      group: { include: { mentor: true } },
      faydaIdentity: true,
      academicRecord: true,
      attendances: true,
      submissions: { include: { score: true } }
    }
  });

  if (!student) redirect("/login");

  // Progress Calculations
  const totalAttendances = student.attendances.length;
  const presentOrLate = student.attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
  const attendancePercentage = totalAttendances > 0 ? Math.round((presentOrLate / totalAttendances) * 100) : 0;

  const totalTasks = await db.task.count({ where: { status: "PUBLISHED" } });
  const submissionsCount = student.submissions.length;
  const gradedSubmissions = student.submissions.filter(s => s.status === "GRADED");
  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score?.points || 0), 0);
  const maxPossibleScoreSoFar = gradedSubmissions.length * 10; // assuming 10 pts per task
  const gradePercentage = maxPossibleScoreSoFar > 0 ? Math.round((totalScore / maxPossibleScoreSoFar) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Student Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><strong className="block text-slate-500">Name</strong>{student.application.fullName}</div>
              <div><strong className="block text-slate-500">Email</strong>{student.email}</div>
              <div><strong className="block text-slate-500">Phone</strong>{student.application.phone}</div>
              <div><strong className="block text-slate-500">Role</strong>Student</div>
              <div><strong className="block text-slate-500">School / Section</strong>Grade {student.application.grade} Section {student.application.section}</div>
              <div><strong className="block text-slate-500">Joined Date</strong>{new Date(student.createdAt).toLocaleDateString()}</div>
              <div className="sm:col-span-2 border-t pt-4">
                <strong className="block text-slate-500">Skills / Interests</strong>
                {student.application.cyberTopics?.length ? student.application.cyberTopics.join(", ") : "General Cybersecurity"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group & Mentor</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {student.group ? (
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                  <p><strong className="text-slate-500">Group Name:</strong> {student.group.name}</p>
                  <p><strong className="text-slate-500">Mentor:</strong> {student.group.mentor?.name || "Not assigned"} {student.group.mentor?.email ? `(${student.group.mentor.email})` : ""}</p>
                </div>
              ) : (
                <p className="text-slate-500">You are not assigned to a group yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold">Attendance Progress</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${attendancePercentage}%` }} />
                  </div>
                  <span className="text-xs font-bold">{attendancePercentage}%</span>
                </div>
                <Link href="/student/attendance" className="text-blue-600 hover:underline mt-2 inline-block">View details &rarr;</Link>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-500 block text-xs uppercase font-bold">Task Progress</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${totalTasks > 0 ? (submissionsCount/totalTasks)*100 : 0}%` }} />
                  </div>
                  <span className="text-xs font-bold">{submissionsCount}/{totalTasks} Submitted</span>
                </div>
                <Link href="/student/tasks" className="text-blue-600 hover:underline mt-2 inline-block">View submissions &rarr;</Link>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-500 block text-xs uppercase font-bold">Grade Average</span>
                <span className="font-bold text-green-600 text-2xl">{gradePercentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader>
              <CardTitle>Certificate Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-white dark:bg-black/20 rounded-lg shadow-sm border border-amber-100 dark:border-amber-800">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Current Status</div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {student.academicRecord?.certificateState || "RESULTS_NOT_FINAL"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verified External Identity</CardTitle>
            </CardHeader>
            <CardContent>
              {student.faydaIdentity ? (
                <div className="space-y-2 text-sm border-l-4 border-green-500 pl-4">
                  <div><strong className="block text-slate-500">Legal Name</strong>{student.faydaIdentity.legalName}</div>
                  <div><strong className="block text-slate-500">Fayda ID</strong>{student.faydaIdentity.externalId}</div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No external Fayda ID verified.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
