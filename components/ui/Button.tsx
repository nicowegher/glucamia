import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "lg" | "md" | "sm";
}

export default function Button({
  children,
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary/50",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-secondary/50",
    danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive/50",
  };

  const sizeStyles = {
    lg: "h-16 px-8 text-xl rounded-lg",
    md: "h-12 px-6 text-lg rounded-lg",
    sm: "h-10 px-4 text-base rounded-md",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

