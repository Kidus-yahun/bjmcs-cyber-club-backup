import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function StudentLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          Loading secure environment...
        </p>
      </div>
    </div>
  );
}
