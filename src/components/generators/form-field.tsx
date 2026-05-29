import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-card-foreground">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[12px] leading-snug text-card-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

const controlClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-[14px] text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

export function FormInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input className={cn(controlClass, props.className)} {...props} />;
}

export function FormSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      className={cn(controlClass, "cursor-pointer", props.className)}
      {...props}
    />
  );
}

export function FormTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] leading-7 text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        props.className,
      )}
      {...props}
    />
  );
}
