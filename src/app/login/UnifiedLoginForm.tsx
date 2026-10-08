"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";
import { ShieldAlert, ArrowRight, Lock, User } from "lucide-react";

export default function UnifiedLoginForm({ blocked = false }: { blocked?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    blocked
      ? "Your Cyber Club account has been deactivated by an administrator. Please contact club administration."
      : null
  );
  const [isBlocked, setIsBlocked] = useState(blocked);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsBlocked(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
        setIsBlocked(result.blocked === true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="border border-red-500/40 bg-red-950/20 p-4 font-mono text-xs text-red-400 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold block uppercase tracking-wider mb-0.5">
              {isBlocked ? "ACCOUNT DEACTIVATED" : "AUTHENTICATION FAILED"}
            </span>
            <span className="leading-relaxed">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
            Identifier (Email, Username, or ID) *
          </label>
          <div className="relative">
            <input
              name="identifier"
              type="text"
              required
              placeholder="e.g. BGMCS-2026-10294 or email"
              className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-[#a2a7b2] block">
              Password *
            </label>
          </div>
          <div className="relative">
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••••••"
              className="w-full border border-[#23262d] bg-[#07080b] px-4 py-3 font-sans text-sm text-[#f4f3ee] placeholder-[#4b5160] focus:border-[#ff3700] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#ff3700] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ff5419] transition-all shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>VERIFYING CREDENTIALS...</span>
            </span>
          ) : (
            <>
              <span>AUTHENTICATE &amp; ENTER &rarr;</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
