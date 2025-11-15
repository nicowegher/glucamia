"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-6 rounded-lg border-2 transition-colors",
      "bg-muted border-border hover:border-primary/50"
    )}>
      <div className="flex-1">
        <label className="text-xl font-semibold text-foreground cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-16 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-4 focus:ring-ring",
          checked ? "bg-primary" : "bg-muted-foreground/30",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 transform rounded-full bg-background transition-transform",
            checked ? "translate-x-9" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

