import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] text-center">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full mb-4">
        <Search className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Page or Record Not Found
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md">
        The admin page or record you are trying to view does not exist.
      </p>
      <div className="mt-6">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
      </div>
    </div>
  );
}
