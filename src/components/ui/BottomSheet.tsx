import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn.utils.ts";
import { Surface } from "./Surface.tsx";
import { Typography } from "./Typography.tsx";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  zIndexBase?: number;
  portal?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  zIndexBase = 1000,
  portal = false,
}: BottomSheetProps) {
  const overlayZ = zIndexBase;
  const sheetZ = zIndexBase + 100;

  const content = (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        onClick={onClose}
        style={{ zIndex: overlayZ }}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 transition-all duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: sheetZ }}
      >
        <Surface className="rounded-t-3xl rounded-b-none shadow-2xl px-6 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h2" className="text-gray-main">
              {title}
            </Typography>
            <button
              onClick={onClose}
              className="p-2 text-slightly-black hover:opacity-80 active:scale-90 transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </Surface>
      </div>
    </>
  );

  if (portal && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
