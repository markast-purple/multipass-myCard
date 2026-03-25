import { cn } from "../../utils/cn.utils.ts";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "w-11 h-6 rounded-full transition-all duration-200 flex items-center px-1",
        checked ? "bg-primary" : "bg-border",
        disabled && "opacity-60 cursor-not-allowed",
      )}
      aria-pressed={checked}
      aria-disabled={disabled}
    >
      <span
        className={cn(
          "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200",
          checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
