import { SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export default function Select({
  label,
  error,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full h-14 px-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 bg-background text-foreground",
          error
            ? "border-destructive focus:ring-destructive/50"
            : "border-input focus:border-ring focus:ring-ring/50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

