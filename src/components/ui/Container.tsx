import { cn } from "../../utils/cn.utils.ts";
import type { ReactNode, ElementType } from "react";

interface ContainerProps {
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
}: ContainerProps) => {
  return (
    <Component
      className={cn(
        "w-full mx-auto max-w-md",
        !noPadding && "px-4 sm:px-6",
        className,
      )}
    >
      {children}
    </Component>
  );
};
