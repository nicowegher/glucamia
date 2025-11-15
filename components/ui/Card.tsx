import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg shadow-md p-6 border border-border",
        className
      )}
    >
      {children}
    </div>
  );
}

