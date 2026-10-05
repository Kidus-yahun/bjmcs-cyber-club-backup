"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { permanentlyDeleteKickedStudent, restoreStudent } from "@/lib/actions/students";

export default function KickedStudentActions({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    if (!window.confirm("Restore this student to the active Cyber Club members?")) return;

    startTransition(async () => {
      const result = await restoreStudent(studentId);
      if (!result.success) {
        window.alert(result.error || "Failed to restore student.");
        return;
      }
      router.refresh();
    });
  };

  const handlePermanentDelete = () => {
    if (!window.confirm("Permanently delete this student?\n\nThis will permanently remove the student and their related data from the system. This action cannot be undone.")) return;

    startTransition(async () => {
      const result = await permanentlyDeleteKickedStudent(studentId);
      if (!result.success) {
        window.alert(result.error || "Failed to permanently delete student.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={handleRestore}
        disabled={isPending}
        className="rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
      >
        {isPending ? "Working..." : "Restore Student"}
      </button>
      <button
        type="button"
        onClick={handlePermanentDelete}
        disabled={isPending}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60"
      >
        Permanently Delete
      </button>
    </div>
  );
}