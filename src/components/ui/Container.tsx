import { cn } from "../../utils/cn.utils.ts";
import type { ReactNode, ElementType, HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  noPadding?: boolean;
}

export const Container = ({
  children,
  className,
  as: Component = "div",
  noPadding = false,
  ...props
}: ContainerProps) => {
  return (
    <Component
      className={cn("w-full mx-auto", !noPadding && "px-4 sm:px-6", className)}
      {...props}
    >
      {children}
    </Component>
  );
};
