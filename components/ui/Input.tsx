import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-lg font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full h-14 px-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-4",
          error
            ? "border-destructive focus:ring-destructive/50"
            : "border-input focus:border-ring focus:ring-ring/50",
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

