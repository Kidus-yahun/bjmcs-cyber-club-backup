"use client";

import { useTransition } from "react";
import { toggleRegistrationStatus } from "@/lib/actions/registration";

export default function RegistrationControl({ isOpen }: { isOpen: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleRegistrationStatus(!isOpen);
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Registration Status</h3>
        <p className="text-sm text-slate-500">
          Currently: <span className={isOpen ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {isOpen ? "OPEN" : "CLOSED"}
          </span>
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isOpen 
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200" 
            : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPending ? "Updating..." : (isOpen ? "Close Registration" : "Open Registration")}
      </button>
    </div>
  );
}
