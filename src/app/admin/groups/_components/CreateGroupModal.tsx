"use client";

import { useState, useTransition } from "react";
import { createGroup } from "@/lib/actions/groups";
import { Button, Input, Alert } from "@/components/ui";

export default function CreateGroupModal({ mentors }: { mentors: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const name = formData.get("name") as string;
        const mentorId = formData.get("mentorId") as string;
        
        await createGroup(name, mentorId === "none" ? undefined : mentorId);
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ New Group</Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">Create Group (Cohort)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error" title="Error" children={error} />}
              <Input label="Group Name" name="name" required placeholder="e.g. Cohort Alpha" />
              <div>
                <label className="block text-sm font-medium mb-1">Assign Mentor (Optional)</label>
                <select name="mentorId" className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                  <option value="none">-- Select Mentor --</option>
                  {mentors.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Create Group"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
