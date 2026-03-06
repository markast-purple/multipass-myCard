import { cn } from "../../utils/cn.utils.ts";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 active:scale-95 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-gray-200 active:scale-95",
  ghost:
    "bg-transparent text-secondary-foreground hover:bg-gray-100 active:scale-95",
  outline:
    "bg-transparent border border-border text-secondary-foreground hover:bg-gray-50 active:scale-95",
};

export const Button = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2",
        fullWidth && "w-full",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
