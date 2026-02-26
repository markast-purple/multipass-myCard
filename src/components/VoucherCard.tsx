import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { cn } from "../utils/cn.utils.ts";
import type { BalanceItem } from "../types/balance.dto.ts";

export type VoucherStatus = "active" | "redeemed" | "expired";

interface VoucherCardProps {
  balance: BalanceItem;
  status: VoucherStatus;
  className?: string;
  onAction?: () => void;
}

export const VoucherCard = ({
  balance,
  status,
  className,
  onAction,
}: VoucherCardProps) => {
  const { t } = useTranslation();

  const remaining = balance.currentBalance;
  const total = balance.allocation;

  const isActive = status === "active";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden shadow-lg border transition-all",
        isActive
          ? "bg-linear-to-br from-[#1a3a4a] to-[#0d2633] border-[#2a5a6a]/30 text-white"
          : "bg-linear-to-br from-gray-100 to-gray-50 border-gray-200 text-gray-800",
        className,
      )}
    >
      <div className="flex flex-col p-5 gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm font-medium leading-tight min-h-10",
              isActive ? "text-white" : "text-gray-600",
            )}
          >
            {t("vouchers.card.provider")}: {balance.name}
          </span>
          <span
            className={cn(
              "text-xs font-medium shrink-0 tabular-nums",
              isActive ? "text-white/50" : "text-gray-400",
            )}
          >
            {balance.purchaseDate || "DD/MM/YEAR"}
          </span>
        </div>

        <div className="flex items-center py-4">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-[100px] leading-normal font-bold tracking-tighter",
                isActive ? "text-white" : "text-gray-800",
              )}
            >
              {balance.allocation.toLocaleString()}
            </span>
            <span
              className={cn(
                "text-5xl font-medium",
                isActive ? "text-white" : "text-gray-600",
              )}
            >
              {t("vouchers.card.amount")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium tabular-nums",
              isActive ? "text-white/60" : "text-gray-400",
            )}
          >
            {t("vouchers.card.validUntil")}: {balance.validUntil || "MM/YY"}
          </span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              isActive
                ? "bg-white/10 text-white/80"
                : status === "redeemed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-500",
            )}
          >
            {t("vouchers.card.remaining", { remaining, total })}
          </span>
        </div>
      </div>

      <button
        onClick={onAction}
        className={cn(
          "flex items-center justify-center gap-2 py-3.5 text-base font-semibold transition-colors cursor-pointer",
          isActive
            ? "bg-white/10 hover:bg-white/15 text-white border-t border-white/10"
            : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-t border-gray-200",
        )}
      >
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        <span>
          {isActive
            ? t("vouchers.card.redeemCta")
            : t("vouchers.card.detailsCta")}
        </span>
      </button>
    </div>
  );
};
