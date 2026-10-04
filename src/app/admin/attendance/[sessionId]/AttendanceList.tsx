"use client";

import { useState } from "react";
import { markAttendance, updateSessionStatus } from "@/lib/actions/attendance";
import { Card, CardContent, Button, Select } from "@/components/ui";
import { AttendanceStatus, SessionStatus } from "@prisma/client";

type StudentData = {
  studentId: string;
  name: string;
  status: AttendanceStatus | null;
  notes: string;
};

export default function AttendanceList({ 
  sessionId, 
  initialData, 
  sessionStatus 
}: { 
  sessionId: string; 
  initialData: StudentData[];
  sessionStatus: SessionStatus;
}) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    setIsUpdating(studentId);
    try {
      await markAttendance(sessionId, studentId, status, data.find(d => d.studentId === studentId)?.notes);
      setData(prev => prev.map(d => d.studentId === studentId ? { ...d, status } : d));
    } catch (e) {
      alert("Failed to update attendance");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleNotesChange = async (studentId: string, notes: string) => {
    const status = data.find(d => d.studentId === studentId)?.status;
    if (!status) return; // Only save notes if status is already set
    
    setIsUpdating(studentId);
    try {
      await markAttendance(sessionId, studentId, status, notes);
      setData(prev => prev.map(d => d.studentId === studentId ? { ...d, notes } : d));
    } catch (e) {
      alert("Failed to update notes");
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleSession = async () => {
    const newStatus = sessionStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await updateSessionStatus(sessionId, newStatus);
    } catch (e) {
      alert("Failed to change session status");
    }
  };

  return (
    <Card>
      <div className="p-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-semibold text-sm">Enrolled Students ({data.length})</h3>
        <Button 
          variant={sessionStatus === 'OPEN' ? 'outline' : 'primary'} 
          size="sm"
          onClick={toggleSession}
        >
          {sessionStatus === 'OPEN' ? 'Close Session' : 'Reopen Session'}
        </Button>
      </div>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-500 w-1/3">Student</th>
              <th className="px-6 py-3 font-medium text-slate-500 w-1/3">Status</th>
              <th className="px-6 py-3 font-medium text-slate-500">Notes (Optional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map(student => (
              <tr key={student.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                <td className="px-6 py-4 font-medium">{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(student.studentId, s)}
                        disabled={sessionStatus === 'CLOSED' || isUpdating === student.studentId}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          student.status === s 
                            ? s === 'PRESENT' ? 'bg-green-500 text-white' 
                              : s === 'ABSENT' ? 'bg-red-500 text-white' 
                              : s === 'LATE' ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    defaultValue={student.notes}
                    onBlur={(e) => {
                      if (e.target.value !== student.notes) {
                        handleNotesChange(student.studentId, e.target.value);
                      }
                    }}
                    placeholder={student.status ? "Add note..." : "Set status first"}
                    disabled={!student.status || sessionStatus === 'CLOSED' || isUpdating === student.studentId}
                    className="w-full text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-colors py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
