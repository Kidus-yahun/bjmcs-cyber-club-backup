"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { kickSelectedStudent, updateApplicationStatus, processApplicationUpdateEmail, processSelectionEmail } from "./actions";
import { ApplicationStatus, SelectionEmailStatus } from "@prisma/client";
import { Mail, ShieldCheck, ShieldAlert, Shield, Loader2, RotateCcw } from "lucide-react";

export default function StatusSelector({ 
  applicationId, 
  studentId,
  studentKicked,
  currentStatus,
  emailStatus,
  applicationUpdateEmailStatus
}: { 
  applicationId: string; 
  studentId: string | null;
  studentKicked: boolean;
  currentStatus: ApplicationStatus;
  emailStatus: SelectionEmailStatus;
  applicationUpdateEmailStatus: SelectionEmailStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEmailing, startEmailTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    if (newStatus !== currentStatus) {
      startTransition(async () => {
        await updateApplicationStatus(applicationId, newStatus);
        router.refresh();
      });
    }
  };

  const retryEmail = () => {
    startEmailTransition(async () => {
      await processSelectionEmail(applicationId);
      router.refresh();
    });
  };

  const retryApplicationUpdateEmail = () => {
    startEmailTransition(async () => {
      await processApplicationUpdateEmail(applicationId);
      router.refresh();
    });
  };

  const handleRemoveStudent = () => {
    if (!studentId || !window.confirm("Are you sure you want to deactivate this student?")) return;
    const reason = window.prompt("Reason for removal (optional):") || "";

    startTransition(async () => {
      const result = await kickSelectedStudent(studentId, reason);
      if (!result.success) {
        window.alert(result.error || "Failed to deactivate student.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end space-y-3 w-full md:w-auto">
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-[#0f172a] p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <label htmlFor="status" className="pl-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">
          Status
        </label>
        <div className="relative flex-1 sm:flex-none">
          <select
            id="status"
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={isPending || isEmailing}
            className={`w-full sm:w-48 appearance-none pl-9 pr-8 py-2 text-sm font-bold rounded-md border focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm ${
              currentStatus === "SELECTED" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30" :
              currentStatus === "NOT_SELECTED" ? "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600" :
              "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
            } ${isPending ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
          >
            <option value="PENDING">PENDING</option>
            <option value="SELECTED">SELECTED</option>
            <option value="NOT_SELECTED">NOT SELECTED</option>
          </select>
          
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {currentStatus === "SELECTED" && <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />}
            {currentStatus === "NOT_SELECTED" && <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            {currentStatus === "PENDING" && <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            )}
          </div>
        </div>
      </div>

      {(currentStatus === "SELECTED" || (currentStatus === "NOT_SELECTED" && !studentKicked)) && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500 dark:text-slate-400">{currentStatus === "SELECTED" ? "Acceptance email:" : "Application update:"}</span>
          
          {currentStatus === "NOT_SELECTED" ? (
            applicationUpdateEmailStatus === "SENT" ? (
              <span className="inline-flex items-center gap-1 font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 px-2 py-0.5 rounded shadow-sm border border-green-200 dark:border-green-800/50">
                <ShieldCheck className="w-3 h-3" /> Email Sent
              </span>
            ) : applicationUpdateEmailStatus === "FAILED" ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-medium text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 px-2 py-0.5 rounded shadow-sm border border-red-200 dark:border-red-800/50">
                  <ShieldAlert className="w-3 h-3" /> Failed
                </span>
                <button onClick={retryApplicationUpdateEmail} disabled={isEmailing} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline disabled:opacity-50 transition-colors">
                  {isEmailing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                  {isEmailing ? "Retrying..." : "Retry"}
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-200 dark:text-slate-300 dark:bg-slate-700 px-2 py-0.5 rounded shadow-sm border border-slate-300 dark:border-slate-600">Pending</span>
            )
          ) : emailStatus === "SENT" ? (
            <span className="inline-flex items-center gap-1 font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 px-2 py-0.5 rounded shadow-sm border border-green-200 dark:border-green-800/50">
              <ShieldCheck className="w-3 h-3" /> Email Sent
            </span>
          ) : emailStatus === "FAILED" ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-medium text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 px-2 py-0.5 rounded shadow-sm border border-red-200 dark:border-red-800/50">
                <ShieldAlert className="w-3 h-3" /> Failed
              </span>
              <button 
                onClick={retryEmail} 
                disabled={isEmailing}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline disabled:opacity-50 transition-colors"
              >
                {isEmailing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                {isEmailing ? "Retrying..." : "Retry"}
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-200 dark:text-slate-300 dark:bg-slate-700 px-2 py-0.5 rounded shadow-sm border border-slate-300 dark:border-slate-600">
              Pending
            </span>
          )}

          {currentStatus === "SELECTED" && studentId && (
          <button
            type="button"
            onClick={handleRemoveStudent}
            disabled={isPending || isEmailing}
            className="ml-1 rounded border border-red-200 px-2 py-1 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isPending ? "Deactivating..." : "Kick Student"}
          </button>
          )}
        </div>
      )}
    </div>
  );
}
