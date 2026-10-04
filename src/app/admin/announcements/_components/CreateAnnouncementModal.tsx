"use client";

import { useState, useTransition } from "react";
import { createAnnouncement } from "@/lib/actions/announcements";
import { Button, Input, Textarea, Alert } from "@/components/ui";
import { AnnouncementStatus, AssignmentTargetType } from "@prisma/client";

export default function CreateAnnouncementModal({ groups, students }: { groups: any[], students: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<AssignmentTargetType>(AssignmentTargetType.ALL);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as AnnouncementStatus;
    const groupId = formData.get("groupId") as string;
    const studentId = formData.get("studentId") as string;

    startTransition(async () => {
      try {
        await createAnnouncement({
          title,
          content,
          status,
          targetType,
          groupId: targetType === 'GROUP' ? groupId : undefined,
          studentId: targetType === 'INDIVIDUAL' ? studentId : undefined,
        });
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "Failed to create announcement.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Create Announcement</Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error" title="Error" children={error} />}
              <Input label="Title" name="title" required />
              <Textarea label="Content" name="content" rows={5} required />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select name="status" className="w-full rounded-md border p-2 text-sm mt-1" required>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold text-sm">Target Audience</h3>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" checked={targetType === 'ALL'} onChange={() => setTargetType('ALL')} /> All</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" checked={targetType === 'GROUP'} onChange={() => setTargetType('GROUP')} /> Group</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" checked={targetType === 'INDIVIDUAL'} onChange={() => setTargetType('INDIVIDUAL')} /> Individual</label>
                </div>
                {targetType === 'GROUP' && (
                  <select name="groupId" className="w-full rounded-md border p-2 text-sm" required>
                    <option value="">Select Group...</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                )}
                {targetType === 'INDIVIDUAL' && (
                  <select name="studentId" className="w-full rounded-md border p-2 text-sm" required>
                    <option value="">Select Student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.application.fullName}</option>)}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Announcement"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
