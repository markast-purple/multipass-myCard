import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils/cn.utils.ts";
import { getCardColors } from "../utils/cardColors.utils.ts";
import type { BalanceItem } from "../types/balance.dto.ts";

export const VOUCHER_STATUS = {
  ACTIVE: "active",
  REDEEMED: "redeemed",
  EXPIRED: "expired",
} as const;

export type VoucherStatus =
  (typeof VOUCHER_STATUS)[keyof typeof VOUCHER_STATUS];

interface VoucherCardProps {
  balance: BalanceItem;
  status: VoucherStatus;
  colorIndex?: number;
  className?: string;
  onAction?: () => void;
  isCollapsed?: boolean;
  isAbove?: boolean;
  isStacked: boolean;
}

export const VoucherCard = ({
  balance,
  status,
  colorIndex = 0,
  className,
  onAction,
  isCollapsed = false,
  isAbove = false,
  isStacked,
}: VoucherCardProps) => {
  const { t } = useTranslation();

  const remaining = balance.currentBalance;
  const total = balance.allocation;

  const isActive = status === VOUCHER_STATUS.ACTIVE;
  const colors = getCardColors(colorIndex);

  const cardStyle = {
    background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
    borderColor: colors.border,
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl overflow-hidden transition-all duration-400 ease-in-out",
        "backdrop-blur-xl border-2 text-white",
        className,
      )}
      style={{ ...cardStyle, height: "100%" }}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-400 bg-linear-to-b from-white/12 via-transparent to-black/10",
        )}
      />

      <div
        className={cn(
          "w-full flex justify-between px-5 transition-all duration-400 py-3",
          isCollapsed && isStacked
            ? "opacity-100 h-full"
            : "opacity-0 pointer-events-none absolute inset-0 ",
          isCollapsed && (isAbove ? "items-start" : "items-end"),
        )}
      >
        <span className="relative text-sm font-bold text-white/90 truncate max-w-[60%] leading-tight">
          {balance.name}
        </span>
        <div className="relative flex items-baseline gap-1 shrink-0">
          <span className="text-2xl font-bold tabular-nums text-white">
            {balance.allocation.toLocaleString()}
          </span>
          <span className="text-base font-medium text-white/70">₪</span>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col p-5 gap-3 flex-1 relative transition-all duration-400",
          !isCollapsed
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4  pointer-events-none absolute inset-0",
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-start justify-between">
            <span className="text-sm font-bold leading-tight text-white/90">
              {balance.provider ||
                balance.companies?.[0] ||
                t("vouchers.card.provider")}
            </span>
            <span className="text-xs uppercase shrink-0 tracking-wider tabular-nums px-2 py-0.5 rounded-full bg-white/10 text-white/50">
              {t("vouchers.card.validUntil")} {balance.validUntil || "MM/YY"}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-snug line-clamp-2 text-white/75">
            {balance.name}
          </h3>
        </div>

        <div className="flex items-center py-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl font-bold tracking-tighter tabular-nums drop-shadow-sm text-white">
              {balance.allocation.toLocaleString()}
            </span>
            <span className="text-2xl font-medium text-white/70">₪</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm bg-white/15 text-white/90 border border-white/20">
              {t("vouchers.card.remaining", { remaining, total })}
            </span>
            {isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.();
                }}
                className="flex items-center rounded-2xl justify-center gap-1.5 py-2.5 text-sm font-bold transition-all cursor-pointer px-4 backdrop-blur-sm border bg-white/15 hover:bg-white/25 text-white border-white/25 active:scale-95"
              >
                <span>{t("vouchers.card.detailsCta")}</span>
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
