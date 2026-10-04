import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ActivationForm from "./ActivationForm";

export const dynamic = "force-dynamic";

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Invalid Activation Link</h1>
          <p className="text-slate-600 mt-2">No activation token was provided.</p>
        </div>
      </div>
    );
  }

  const student = await db.student.findUnique({
    where: { activationToken: token },
    include: { application: true }
  });

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Invalid Activation Link</h1>
          <p className="text-slate-600 mt-2">This activation link is invalid or has already been used.</p>
        </div>
      </div>
    );
  }

  if (student.activationExpires && student.activationExpires < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Link Expired</h1>
          <p className="text-slate-600 mt-2">Your activation link has expired. Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Activate Account</h1>
          <p className="text-sm text-slate-500 mt-2">
            Welcome, {student.application.fullName}! Set your password to activate your portal account.
          </p>
        </div>
        
        <ActivationForm token={token} />
      </div>
    </div>
  );
}
