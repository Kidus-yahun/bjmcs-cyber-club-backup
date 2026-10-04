"use client";

import { useState, useTransition } from "react";
import { createMentor } from "@/lib/actions/groups";
import { Button, Input, Alert } from "@/components/ui";

export default function CreateMentorModal() {
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
        const email = formData.get("email") as string;
        
        await createMentor(name, email);
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      }
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>+ Add Mentor</Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">Add Mentor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error" title="Error" children={error} />}
              <Input label="Name" name="name" required />
              <Input label="Email" name="email" type="email" />
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Add Mentor"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
