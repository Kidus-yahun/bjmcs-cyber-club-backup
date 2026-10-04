import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-800 dark:text-blue-200",
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  warning:
    "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  error:
    "border-red-500/20 bg-red-500/10 text-red-800 dark:text-red-200",
};

function Alert({ variant = "info", title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border p-4 backdrop-blur-sm transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  );
}

export { Alert, type AlertProps, type AlertVariant };
