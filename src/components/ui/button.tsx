import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]":
              variant === "primary",
            "bg-[var(--color-secondary)] text-white hover:opacity-90 focus:ring-[var(--color-secondary)]":
              variant === "secondary",
            "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] focus:ring-[var(--color-primary)]":
              variant === "outline",
            "bg-transparent hover:bg-[var(--color-muted)] focus:ring-[var(--color-primary)]":
              variant === "ghost",
            "bg-[var(--color-destructive)] text-white hover:opacity-90 focus:ring-[var(--color-destructive)]":
              variant === "destructive",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
export type { ButtonProps };
