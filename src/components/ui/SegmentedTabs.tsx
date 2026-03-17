import type { ReactNode } from "react";
import { Surface } from "./Surface.tsx";
import { Typography } from "./Typography.tsx";
import { cn } from "../../utils/cn.utils.ts";

export type SegmentedTab<Key extends string> = {
  key: Key;
  label: ReactNode;
};

type Density = "default" | "compact";

export function SegmentedTabs<Key extends string>({
  tabs,
  value,
  onChange,
  className,
  density = "default",
}: {
  tabs: SegmentedTab<Key>[];
  value: Key;
  onChange: (key: Key) => void;
  className?: string;
  density?: Density;
}) {
  return (
    <Surface
      variant="muted"
      className={cn(
        "flex gap-1 p-1 rounded-xl border border-border",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex-1 rounded-lg transition-all duration-200",
            density === "compact" ? "px-2 py-2" : "px-3 py-2.5",
            value === tab.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-slightly-black hover:text-full-dark active:bg-gray-200",
          )}
        >
          <Typography variant="small" className="font-semibold text-inherit">
            {tab.label}
          </Typography>
        </button>
      ))}
    </Surface>
  );
}

