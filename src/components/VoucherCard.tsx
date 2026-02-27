import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils/cn.utils.ts";
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
  className?: string;
  onAction?: () => void;
  isFocused?: boolean;
}

export const VoucherCard = ({
  balance,
  status,
  className,
  onAction,
  isFocused = true,
}: VoucherCardProps) => {
  const { t } = useTranslation();

  const remaining = balance.currentBalance;
  const total = balance.allocation;

  const isActive = status === VOUCHER_STATUS.ACTIVE;

  const handleCardClick = () => {
    if (!isActive) {
      onAction?.();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 h-full",
        isActive
          ? "bg-linear-to-br from-[#1a3a4a] to-[#0d2633] border-[#2a5a6a]/30 text-white"
          : "bg-linear-to-br from-gray-100 to-gray-50 border-gray-200 text-gray-800",
        !isFocused ? "pointer-events-none" : !isActive ? "cursor-pointer" : "",
        !isFocused && "scale-90 opacity-70 blur-[2px]",
        className,
      )}
    >
      <div className="flex flex-col p-5 gap-3 flex-1 relative">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-start justify-between">
            <span
              className={cn(
                "text-sm font-bold leading-tight",
                isActive ? "text-white" : "text-gray-900",
              )}
            >
              {balance.provider ||
                balance.companies?.[0] ||
                t("vouchers.card.provider")}
            </span>
            <span
              className={cn(
                "text-sm uppercase shrink-0 tracking-wider tabular-nums",
                isActive ? "text-white/40" : "text-gray-400",
              )}
            >
              {t("vouchers.card.validUntil")} {balance.validUntil || "MM/YY"}
            </span>
          </div>
          <h3
            className={cn(
              "text-lg font-medium leading-snug line-clamp-2",
              isActive ? "text-white/90" : "text-gray-700",
            )}
          >
            {balance.name}
          </h3>
        </div>

        <div className="flex items-center py-2">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-6xl font-bold tracking-tighter tabular-nums",
                isActive ? "text-white" : "text-gray-800",
              )}
            >
              {balance.allocation.toLocaleString()}
            </span>
            <span
              className={cn(
                "text-2xl font-medium",
                isActive ? "text-white/80" : "text-gray-600",
              )}
            >
              ₪
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs px-3 py-1 rounded-full font-semibold",
                isActive
                  ? "bg-white/10 text-white/90"
                  : status === VOUCHER_STATUS.REDEEMED
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {t("vouchers.card.remaining", { remaining, total })}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction?.();
        }}
        className={cn(
          "flex items-center justify-center gap-2 py-3.5 text-base font-bold transition-colors cursor-pointer w-full",
          isActive
            ? "bg-white/10 hover:bg-white/15 text-white border-t border-white/10"
            : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-t border-gray-200",
        )}
      >
        <span>
          {isActive
            ? t("vouchers.card.redeemCta")
            : t("vouchers.card.detailsCta")}
        </span>
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </button>
    </div>
  );
};
