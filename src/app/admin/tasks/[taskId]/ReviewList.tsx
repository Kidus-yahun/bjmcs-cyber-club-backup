"use client";

import { useState } from "react";
import { gradeSubmission } from "@/lib/actions/tasks";
import { Card, CardContent, Button, Textarea, Input, Alert } from "@/components/ui";

type ReviewData = {
  studentId: string;
  name: string;
  submission: any;
};

export default function ReviewList({ reviewData, task }: { reviewData: ReviewData[], task: any }) {
  const [data, setData] = useState(reviewData);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL"); // ALL, SUBMITTED, NOT_SUBMITTED, GRADED

  const filteredData = data.filter(d => {
    if (filter === "ALL") return true;
    if (filter === "SUBMITTED") return d.submission && d.submission.status !== "GRADED";
    if (filter === "NOT_SUBMITTED") return !d.submission;
    if (filter === "GRADED") return d.submission?.status === "GRADED";
    return true;
  });

  const selectedData = data.find(d => d.studentId === selectedStudent);

  const handleGrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedData?.submission) return;

    const formData = new FormData(e.currentTarget);
    const points = parseFloat(formData.get("points") as string);
    const feedback = formData.get("feedback") as string;

    try {
      await gradeSubmission(selectedData.submission.id, points, feedback);
      
      // Update local state
      setData(prev => prev.map(d => {
        if (d.studentId === selectedStudent && d.submission) {
          return {
            ...d,
            submission: {
              ...d.submission,
              status: "GRADED",
              score: { points, feedback }
            }
          };
        }
        return d;
      }));
      
      alert("Grade saved successfully!");
    } catch (err) {
      alert("Failed to save grade.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex gap-2">
          <select 
            className="w-full rounded-md border p-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Students ({data.length})</option>
            <option value="SUBMITTED">Needs Review ({data.filter(d => d.submission && d.submission.status !== "GRADED").length})</option>
            <option value="NOT_SUBMITTED">Not Submitted ({data.filter(d => !d.submission).length})</option>
            <option value="GRADED">Graded ({data.filter(d => d.submission?.status === "GRADED").length})</option>
          </select>
        </div>

        <Card>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredData.length === 0 && <p className="p-4 text-sm text-slate-500">No students match filter.</p>}
            {filteredData.map(d => (
              <button
                key={d.studentId}
                onClick={() => setSelectedStudent(d.studentId)}
                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${selectedStudent === d.studentId ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''}`}
              >
                <div className="font-medium text-sm">{d.name}</div>
                <div className="text-xs mt-1">
                  {!d.submission && <span className="text-slate-500">Not Submitted</span>}
                  {d.submission?.status === "SUBMITTED" && <span className="text-blue-600">Submitted</span>}
                  {d.submission?.status === "LATE" && <span className="text-amber-600">Late Submission</span>}
                  {d.submission?.status === "GRADED" && <span className="text-green-600">Graded ({d.submission.score.points} pts)</span>}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Review Panel */}
      <div className="lg:col-span-2">
        {selectedData ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedData.name}'s Submission</h3>
              
              {!selectedData.submission ? (
                <Alert variant="warning" title="No Submission" children="This student has not submitted the task yet." />
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm space-y-2 border">
                    <div><span className="font-semibold">Submitted At:</span> {new Date(selectedData.submission.createdAt).toLocaleString()}</div>
                    {selectedData.submission.status === "LATE" && <div className="text-amber-600 font-bold">LATE SUBMISSION</div>}
                    
                    {selectedData.submission.link && (
                      <div className="space-y-1">
                        <span className="font-semibold">Legacy Link:</span> 
                        <a href={selectedData.submission.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all ml-2">{selectedData.submission.link}</a>
                      </div>
                    )}
                    
                    {selectedData.submission.links && selectedData.submission.links.length > 0 ? (
                      <div className="space-y-1">
                        <span className="font-semibold">Links:</span>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {selectedData.submission.links.map((link: string, i: number) => (
                            <li key={i}>
                              <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{link}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      !selectedData.submission.link && (
                        <div><span className="font-semibold">Links:</span> <span className="text-slate-400 italic ml-2">None provided</span></div>
                      )
                    )}
                    
                    {selectedData.submission.fileUrl && selectedData.submission.originalFileName ? (
                      <div>
                        <span className="font-semibold">File:</span> 
                        <a href={`/api/files/${selectedData.submission.fileUrl}`} target="_blank" className="ml-2 text-blue-600 hover:underline font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download {selectedData.submission.originalFileName}
                        </a>
                      </div>
                    ) : (
                      <div><span className="font-semibold">File:</span> <span className="text-slate-400 italic ml-2">None attached</span></div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Submission Content / Text:</h4>
                    <div className="p-4 bg-white dark:bg-slate-950 border rounded-lg whitespace-pre-wrap text-sm">
                      {selectedData.submission.content || <span className="text-slate-400 italic">No text provided.</span>}
                    </div>
                  </div>

                  {selectedData.submission.studentNote && (
                    <div>
                      <h4 className="font-semibold mb-2">Student Note:</h4>
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 rounded-lg text-sm">
                        {selectedData.submission.studentNote}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-lg mb-4">Grading & Feedback</h4>
                    <form onSubmit={handleGrade} className="space-y-4">
                      <div className="w-1/3">
                        <Input 
                          label="Points" 
                          name="points" 
                          type="number" 
                          step="0.1" 
                          required 
                          defaultValue={selectedData.submission.score?.points ?? ""}
                        />
                      </div>
                      <Textarea 
                        label="Feedback for Student" 
                        name="feedback" 
                        rows={4} 
                        defaultValue={selectedData.submission.score?.feedback ?? ""}
                      />
                      <Button type="submit">
                        {selectedData.submission.status === "GRADED" ? "Update Grade" : "Submit Grade"}
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            Select a student to review their submission
          </div>
        )}
      </div>
    </div>
  );
}
