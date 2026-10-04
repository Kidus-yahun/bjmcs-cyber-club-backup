import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200",
        "dark:border-slate-800 dark:bg-[#0f172a]",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("mb-4 space-y-1", className)}>{children}</div>
  );
}

function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-slate-100",
        className
      )}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-sm text-slate-500 dark:text-slate-400",
        className
      )}
    >
      {children}
    </p>
  );
}

function CardContent({ children, className }: CardProps) {
  return <div className={cn(className)}>{children}</div>;
}

function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn("mt-4 flex items-center", className)}>{children}</div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
