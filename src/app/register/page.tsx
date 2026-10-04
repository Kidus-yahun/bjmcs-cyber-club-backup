import { Metadata } from "next";
import { db } from "@/lib/db";
import { RegistrationForm } from "./_components/RegistrationForm";
import { Card, CardContent, CardHeader, CardTitle, Alert } from "@/components/ui";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Register",
  description: "Apply to join the BJMCS Cyber Club",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  let settings = null;
  try {
    settings = await db.registrationSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to fetch registration settings:", error);
  }

  const isOpen = settings?.isOpen ?? false;
  const isPastDeadline = settings?.deadline ? new Date() > settings?.deadline : false;

  const isClosed = !isOpen || isPastDeadline;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a1628] selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl mb-6">
          Apply to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{settings?.clubDisplayName || siteConfig.name}</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light">
          We are looking for passionate students ready to explore the world of cybersecurity. Join our elite academy of future defenders.
        </p>
      </div>

      {isClosed ? (
        <Card className="max-w-2xl mx-auto text-center border-slate-200 dark:border-slate-800/60 shadow-xl dark:shadow-blue-900/10 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              {isPastDeadline ? (
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              ) : (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              )}
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isPastDeadline ? "Registration Deadline Passed" : "Registration Closed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            {isPastDeadline ? (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                The application deadline for this registration period has passed. We are currently reviewing the submitted applications.
              </p>
            ) : (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Registration is currently unavailable. We open applications during specific enrollment windows. Please check back later.
              </p>
            )}
            <div className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-600 dark:text-slate-300">
              Thank you to everyone who applied!
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <RegistrationForm />
        </div>
      )}
    </div>
  );
}
