import { cn } from "../../utils/cn.utils.ts";
import type { ReactNode, ElementType, HTMLAttributes } from "react";

type TypographyVariant = "h1" | "h2" | "body" | "small" | "caption";
type TypographySize = "small" | "medium" | "large";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  size?: TypographySize;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-bold leading-tight uppercase tracking-tight text-secondary-foreground",
  h2: "font-semibold leading-snug text-secondary-foreground",
  body: "leading-relaxed text-secondary-foreground",
  small: "leading-tight text-muted",
  caption: "font-bold uppercase tracking-wider text-muted",
};

const sizeStyles: Record<TypographySize, string> = {
  small: "text-xs",
  medium: "text-base",
  large: "text-xl",
};

const defaultVariantSizes: Record<TypographyVariant, TypographySize> = {
  h1: "large",
  h2: "large",
  body: "medium",
  small: "small",
  caption: "small",
};

export const Typography = ({
  variant = "body",
  size,
  children,
  className,
  as,
  ...props
}: TypographyProps) => {
  const Component =
    as || (variant.startsWith("h") ? (variant as ElementType) : "p");

  const finalSize = size || defaultVariantSizes[variant];

  return (
    <Component
      className={cn(variantStyles[variant], sizeStyles[finalSize], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
