"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in the future
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
        Something went wrong
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Try Again
      </button>
    </div>
  );
}
