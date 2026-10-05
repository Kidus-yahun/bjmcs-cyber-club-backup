import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusSelector from "./StatusSelector";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { ArrowLeft, User, ShieldAlert, Heart, Code, FolderOpen, Calendar, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const application = await db.application.findUnique({
    where: { id },
    include: { projects: true, student: { select: { id: true, kickedAt: true } } },
  });

  if (!application) return notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/applications" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Applications
        </Link>
      </div>

      <div className="bg-white dark:bg-[#0a1628] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
            {application.fullName}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
              Ref: {application.reference}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 
              {new Date(application.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <StatusSelector 
            applicationId={application.id} 
            studentId={application.student?.id ?? null}
            studentKicked={Boolean(application.student?.kickedAt)}
            currentStatus={application.status} 
            emailStatus={application.selectionEmailStatus}
            applicationUpdateEmailStatus={application.applicationUpdateEmailStatus}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & School */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-500" /> Personal Dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Age</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.age}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.gender}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.phone}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate" title={application.email}>{application.email}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Telegram Username</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.telegramUsername || "Not provided"}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Grade</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.grade}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Section</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.section}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Background */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="w-5 h-5 text-cyan-500" /> Technical Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-500" /> Studied Cybersecurity?
              </p>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.hasStudiedCyber ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {application.hasStudiedCyber ? "Yes" : "No"}
                </span>
                {application.hasStudiedCyber && application.cyberStudyDesc && (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 border-l-2 border-purple-500 pl-3 italic">
                    "{application.cyberStudyDesc}"
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Programming Experience</p>
              <p className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                {application.programmingExp}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {application.programmingLangs.length ? application.programmingLangs.map(l => (
                    <span key={l} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 rounded-md text-xs font-medium shadow-sm">{l}</span>
                  )) : <span className="text-slate-400 text-sm italic">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Operating Systems</p>
                <div className="flex flex-wrap gap-2">
                  {application.operatingSystems.length ? application.operatingSystems.map((operatingSystem) => (
                    <span key={operatingSystem} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 rounded-md text-xs font-medium shadow-sm">{operatingSystem}</span>
                  )) : <span className="text-slate-400 text-sm italic">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {application.cyberTopics.length ? application.cyberTopics.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800/50 rounded-md text-xs font-medium shadow-sm">{t}</span>
                  )) : <span className="text-slate-400 text-sm italic">None</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivation */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-red-500" /> Motivation & Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Why do you want to join?</p>
                <div className="p-4 bg-slate-50 dark:bg-[#0a1628] rounded-xl border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner h-full">
                  {application.motivationJoin}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">What do you hope to learn?</p>
                <div className="p-4 bg-slate-50 dark:bg-[#0a1628] rounded-xl border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner h-full">
                  {application.motivationLearn}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Weekly Availability</p>
                <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{application.weeklyAvailability.replace(/_/g, " ").toLowerCase()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Discovery Channel</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{application.howHeardAboutUs || "Not specified"}</p>
              </div>
              {application.additionalSkills && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Additional Skills</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{application.additionalSkills}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="w-5 h-5 text-amber-500" /> Portfolio Projects <span className="ml-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">{application.projects.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {application.projects.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <FolderOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No projects submitted with this application.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.projects.map((proj) => (
                  <div key={proj.id} className="p-5 bg-white dark:bg-[#0a1628] border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">{proj.projectName}</h4>
                    {proj.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{proj.description}</p>}
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md transition-colors">
                          <Code className="w-4 h-4 mr-1.5" /> Source Code
                        </a>
                      )}
                      {proj.portfolioUrl && (
                        <a href={proj.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-md transition-colors">
                          Live Demo &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
