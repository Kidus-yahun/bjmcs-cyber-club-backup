"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] text-center">
      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Something went wrong in the Admin Portal
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
      </div>
    </div>
  );
}
