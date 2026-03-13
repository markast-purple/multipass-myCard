import { cn } from "../../utils/cn.utils.ts";
import type { ReactNode, ElementType, HTMLAttributes } from "react";

type SurfaceVariant = "paper" | "muted" | "primary" | "transparent";

interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  variant?: SurfaceVariant;
  children?: ReactNode;
  className?: string;
  as?: ElementType;
  withBorder?: boolean;
}

const variantStyles: Record<SurfaceVariant, string> = {
  paper: "bg-surface text-main-dark",
  muted: "bg-surface-muted text-main-dark",
  primary: "bg-primary text-primary-foreground",
  transparent: "bg-transparent",
};

export const Surface = ({
  variant = "paper",
  children,
  className,
  as: Component = "div",
  withBorder = false,
  ...props
}: SurfaceProps) => {
  return (
    <Component
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        withBorder && "border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
