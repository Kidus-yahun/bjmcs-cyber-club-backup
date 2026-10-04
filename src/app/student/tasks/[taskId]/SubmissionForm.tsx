"use client";

import { useTransition, useState } from "react";
import { submitTask } from "@/lib/actions/student-learning";
import { Button, Input, Textarea, Alert } from "@/components/ui";

export default function SubmissionForm({ 
  taskId, 
  existingSubmission,
  deadline,
  allowLate
}: { 
  taskId: string; 
  existingSubmission: any;
  deadline: Date;
  allowLate: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<string[]>(existingSubmission?.links || []);
  const [linkInput, setLinkInput] = useState("");

  const isGraded = existingSubmission?.status === "GRADED";
  const isOverdue = new Date() > new Date(deadline);
  const isLocked = isGraded || (isOverdue && !allowLate);

  const handleAddLink = () => {
    if (linkInput && linkInput.trim() !== "") {
      try {
        new URL(linkInput);
        setLinks([...links, linkInput.trim()]);
        setLinkInput("");
      } catch (e) {
        setError("Invalid URL format");
      }
    }
  };

  const handleRemoveLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked) {
      setError("Submissions are locked for this task.");
      return;
    }
    
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const finalLinks = [...links];
    if (linkInput && linkInput.trim() !== "") {
      try {
        new URL(linkInput);
        finalLinks.push(linkInput.trim());
      } catch(e) {}
    }
    formData.append("links", JSON.stringify(finalLinks));
    
    const content = formData.get("content") as string;
    
    if (!content.trim()) {
      setError("Submission content cannot be empty.");
      return;
    }

    startTransition(async () => {
      try {
        await submitTask(taskId, formData);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Failed to submit task.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error" title="Error" children={error} />}
      {success && <Alert variant="success" title="Success" children="Your work has been submitted successfully." />}
      {existingSubmission && !success && (
        <Alert variant="info" title="Status" children={`You have already submitted this task. Status: ${existingSubmission.status}`} />
      )}

      <Textarea
        label="Submission Content"
        name="content"
        rows={6}
        required
        defaultValue={existingSubmission?.content || ""}
        disabled={isPending || isLocked}
        placeholder="Enter your answers or essay here..."
      />
      
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Links (Optional)</label>
          <div className="flex gap-2 mb-2">
            <Input 
              placeholder="https://github.com/..." 
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              disabled={isPending || isLocked}
            />
            <Button type="button" onClick={handleAddLink} disabled={isPending || isLocked} variant="outline">
              + Add Link
            </Button>
          </div>
          {links.length > 0 && (
            <ul className="space-y-2 mt-2">
              {links.map((link, idx) => (
                <li key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-sm">
                  <span className="truncate max-w-[300px] sm:max-w-md">{link}</span>
                  {!isLocked && (
                    <button type="button" onClick={() => handleRemoveLink(idx)} className="text-red-500 hover:text-red-700">Remove</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attach File (Optional)</label>
          <input 
            type="file" 
            name="file" 
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isPending || isLocked}
          />
          {existingSubmission?.originalFileName && (
            <p className="text-xs text-slate-500 mt-1">Currently attached: <a href={`/api/files/${existingSubmission.fileUrl}`} target="_blank" className="text-blue-500 hover:underline">{existingSubmission.originalFileName}</a></p>
          )}
          <p className="text-xs text-slate-400 mt-1">Max 10MB. Common formats supported.</p>
        </div>
      </div>

      <Textarea
        label="Note to Mentor (Optional)"
        name="studentNote"
        rows={3}
        defaultValue={existingSubmission?.studentNote || ""}
        disabled={isPending || isLocked}
        placeholder="Any additional context for your mentor..."
      />

      {!isLocked && (
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : existingSubmission ? "Update Submission" : "Submit Task"}
        </Button>
      )}
    </form>
  );
}
