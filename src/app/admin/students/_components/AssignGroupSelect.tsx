"use client";

import { useState, useTransition } from "react";
import { assignGroup } from "@/lib/actions/students";
import { Alert } from "@/components/ui";

export default function AssignGroupSelect({ studentId, currentGroupId, groups }: { studentId: string, currentGroupId: string | null, groups: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroupId = e.target.value === "none" ? null : e.target.value;
    
    startTransition(async () => {
      setError(null);
      try {
        const result = await assignGroup(studentId, newGroupId);
        if (!result.success) {
          setError(result.error || "Failed to update group.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      }
    });
  };

  return (
    <div className="relative">
      <select 
        disabled={isPending}
        value={currentGroupId || "none"}
        onChange={handleChange}
        className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="none">-- Unassigned --</option>
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      {error && (
        <div className="absolute top-full left-0 z-10 mt-1 w-48 text-xs bg-red-100 text-red-700 p-1 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
}
