import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentCertificatePage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/student/login");

  const payload = await verifyJwt(token);
  if (!payload || !payload.studentId) redirect("/student/login");

  const student = await db.student.findUnique({
    where: { id: payload.studentId },
    include: { academicRecord: true }
  });

  if (!student) redirect("/student/login");

  const status = student.academicRecord?.certificateState || "RESULTS_NOT_FINAL";

  const getStatusDisplay = () => {
    switch (status) {
      case "RESULTS_NOT_FINAL":
        return { 
          label: "Results Not Final", 
          color: "text-slate-500", 
          bg: "bg-slate-100 dark:bg-slate-900/50",
          border: "border-slate-200 dark:border-slate-800",
          icon: <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
          desc: "Your final results must be calculated and officially finalized before certificate processing begins." 
        };
      case "PENDING_APPROVAL":
        return { 
          label: "Pending Approval", 
          color: "text-amber-600 dark:text-amber-400", 
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-900/50",
          icon: <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
          desc: "Your results are finalized and currently pending official approval from the Director General." 
        };
      case "APPROVED_READY":
        return { 
          label: "Approved & Preparing", 
          color: "text-blue-600 dark:text-blue-400", 
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-900/50",
          icon: <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
          desc: "Your certificate is approved and is being prepared for physical or digital distribution." 
        };
      case "CERTIFICATE_AVAILABLE":
        return { 
          label: "Certificate Available", 
          color: "text-emerald-600 dark:text-emerald-400", 
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-900/50",
          icon: <svg className="w-16 h-16 text-emerald-500 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
          desc: "Your official cybersecurity academy certificate is now fully available." 
        };
      default:
        return { 
          label: "Unknown State", 
          color: "text-slate-500", 
          bg: "bg-slate-100 dark:bg-slate-900/50",
          border: "border-slate-200 dark:border-slate-800",
          icon: <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
          desc: "Please contact administration regarding your certificate status." 
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-[#0a1628] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Decorative background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">Credential Verification</h1>
        <p className="text-slate-500 dark:text-slate-400">Track the issuance status of your official BGMCS Cyber Club Certificate.</p>
      </div>

      <Card className={`w-full max-w-2xl relative z-10 overflow-hidden transition-all duration-500 shadow-xl border-2 ${display.border} ${display.bg} backdrop-blur-sm`}>
        {status === "CERTIFICATE_AVAILABLE" && (
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
        )}
        
        <CardContent className="flex flex-col items-center text-center p-10 sm:p-14">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-inner bg-white dark:bg-[#0f172a] border ${display.border}`}>
            {display.icon}
          </div>
          
          <div className="space-y-4 max-w-md">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Status Update</div>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-wider ${display.color}`}>
              {display.label}
            </h2>
            <div className="h-1 w-12 bg-current opacity-20 mx-auto rounded-full my-4"></div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {display.desc}
            </p>
          </div>

          {status === "CERTIFICATE_AVAILABLE" && (
            <button className="mt-10 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Official Certificate
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
