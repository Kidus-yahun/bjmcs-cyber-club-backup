"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { markMessageRead } from "@/lib/actions/student-learning";

export default function AnnouncementsView({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMessage = messages.find(m => m.id === selectedId);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.isRead) {
      // Mark locally
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      // Trigger server action
      await markMessageRead(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      <div className="md:col-span-1 overflow-y-auto border rounded-md bg-white dark:bg-slate-950 dark:border-slate-800">
        {messages.length === 0 ? (
          <p className="p-4 text-slate-500 text-sm">No announcements.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {messages.map(msg => (
              <li 
                key={msg.id}
                onClick={() => handleSelect(msg.id)}
                className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${selectedId === msg.id ? 'bg-slate-50 dark:bg-slate-900 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm truncate ${msg.isRead ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-slate-100'}`}>
                    {msg.title}
                  </h3>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></span>}
                </div>
                <p className="text-xs text-slate-500 truncate">{msg.sender}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:col-span-2 border rounded-md bg-white dark:bg-slate-950 dark:border-slate-800 p-6 overflow-y-auto">
        {selectedMessage ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{selectedMessage.title}</h2>
            <div className="flex justify-between items-center text-sm text-slate-500 border-b pb-4 mb-4 dark:border-slate-800">
              <span>From: <strong>{selectedMessage.sender}</strong></span>
              <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
            </div>
            <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
              {selectedMessage.content}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
