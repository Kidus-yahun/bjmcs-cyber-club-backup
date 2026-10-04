"use client";

import { useState, useTransition } from "react";
import { createTask } from "@/lib/actions/tasks";
import { Button, Input, Textarea, Alert, Select } from "@/components/ui";
import { TaskStatus, AssignmentTargetType } from "@prisma/client";

export default function CreateTaskModal({ groups, students }: { groups: any[], students: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<AssignmentTargetType>(AssignmentTargetType.ALL);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const instructions = formData.get("instructions") as string;
    const deadlineStr = formData.get("deadline") as string;
    const allowLateSubmissions = formData.get("allowLateSubmissions") === "on";
    const attachmentUrl = formData.get("attachmentUrl") as string;
    const groupId = formData.get("groupId") as string;
    const studentId = formData.get("studentId") as string;

    if (!title || !instructions || !deadlineStr) {
      setError("Title, instructions, and deadline are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createTask({
          title,
          description,
          instructions,
          deadline: new Date(deadlineStr),
          status: TaskStatus.PUBLISHED,
          allowLateSubmissions,
          attachmentUrl,
          targetType,
          groupId: targetType === 'GROUP' ? groupId : undefined,
          studentId: targetType === 'INDIVIDUAL' ? studentId : undefined,
        });
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "Failed to create task.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Create Task</Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error" title="Error" children={error} />}
              
              <Input label="Task Title" name="title" required />
              <Input label="Short Description" name="description" required />
              <Textarea label="Detailed Instructions" name="instructions" rows={4} required />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Deadline" name="deadline" type="datetime-local" required />
                <Input label="Attachment/Link URL (Optional)" name="attachmentUrl" type="url" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="allowLateSubmissions" name="allowLateSubmissions" defaultChecked />
                <label htmlFor="allowLateSubmissions" className="text-sm">Allow Late Submissions</label>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold text-sm">Assignment Target</h3>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="targetType" value="ALL" checked={targetType === 'ALL'} onChange={() => setTargetType('ALL')} /> All Students
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="targetType" value="GROUP" checked={targetType === 'GROUP'} onChange={() => setTargetType('GROUP')} /> Specific Group
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="targetType" value="INDIVIDUAL" checked={targetType === 'INDIVIDUAL'} onChange={() => setTargetType('INDIVIDUAL')} /> Individual Student
                  </label>
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
                    {students.map(s => <option key={s.id} value={s.id}>{s.application.fullName} ({s.email})</option>)}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Publishing..." : "Publish Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
