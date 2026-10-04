"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";
import { Button, Input, Alert } from "@/components/ui";
import { LockIcon, UserIcon } from "lucide-react"; // Assuming lucide-react is available for icons, else we can use standard inputs without icons. Let's just use standard inputs. I'll omit icons for safety if not 100% sure, but the instructions say to upgrade to use new UI components beautifully.

export default function UnifiedLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="animate-in fade-in slide-in-from-top-1">
          <Alert variant="error" title="Authentication Failed">
            {error}
          </Alert>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-1">
          <Input
            label="Email, Username, or ID"
            name="identifier"
            type="text"
            required
            className="w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            placeholder="Enter your identifier"
          />
        </div>
        
        <div className="space-y-1">
          <Input
            label="Password"
            name="password"
            type="password"
            required
            className="w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            placeholder="••••••••"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-md transition-all duration-200" 
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </span>
          ) : (
            "Sign In to Portal"
          )}
        </Button>
      </div>
    </form>
  );
}
