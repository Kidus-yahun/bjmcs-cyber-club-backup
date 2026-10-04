"use client";

import { useState, useTransition } from "react";
import { createAttendanceSession } from "@/lib/actions/attendance";
import { Button, Input, Alert } from "@/components/ui";

export default function CreateSessionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get("date") as string;
    const title = formData.get("title") as string;
    
    if (!dateStr || !title) {
      setError("Date and title are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createAttendanceSession({
          date: new Date(dateStr),
          title,
        });
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "Failed to create session.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Create Session</Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">Create Attendance Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error" title="Error" children={error} />}
              
              <Input
                label="Date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              
              <Input
                label="Session Title / Topic"
                name="title"
                type="text"
                placeholder="e.g. Intro to Linux"
                required
              />

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
