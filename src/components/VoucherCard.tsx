import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils/cn.utils.ts";
import { getCardColors } from "../utils/cardColors.utils.ts";
import type { BalanceItem } from "../types/balance.dto.ts";
import { Typography } from "./ui/Typography.tsx";
import { Button } from "./ui/Button.tsx";

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
  isStacked?: boolean;
}

export const VoucherCard = ({
  balance,
  status,
  colorIndex = 0,
  className,
  onAction,
  isCollapsed = false,
  isAbove = false,
  isStacked = false,
}: VoucherCardProps) => {
  const { t } = useTranslation();

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
        "backdrop-blur-xl border-2 text-white shadow-lg",
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
          "absolute inset-0 pointer-events-none transition-opacity duration-400 bg-linear-to-b from-white/12 via-transparent to-black/10",
        )}
      />

      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Collapsed view */}
      <div
        className={cn(
          "w-full flex justify-between px-5 transition-all duration-400 py-4",
          isCollapsed && isStacked
            ? "opacity-100 h-full"
            : "opacity-0 pointer-events-none absolute inset-0",
          isCollapsed && (isAbove ? "items-start" : "items-end"),
        )}
      >
        <Typography
          variant="small"
          className="text-white truncate max-w-[60%] font-bold"
        >
          {balance.provider || balance.name}
        </Typography>
        <div className="flex items-baseline gap-1 shrink-0">
          <Typography variant="h1" className="text-white tabular-nums">
            {balance.currentBalance.toLocaleString()}
          </Typography>
          <Typography variant="body" className="text-white/80 font-medium">
            ₪
          </Typography>
        </div>
      </div>

      {/* Expanded view */}
      <div
        className={cn(
          "flex flex-col p-6 gap-6 flex-1 relative transition-all duration-400",
          !isCollapsed
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 pointer-events-none absolute inset-0",
        )}
      >
        {/* 1. Merchant & Voucher Name */}
        <div className="flex flex-col gap-0.5">
          <Typography
            variant="caption"
            className="text-white/80 uppercase tracking-wider font-bold"
          >
            {balance.provider || t("vouchers.card.provider")}
          </Typography>
          <Typography
            variant="h2"
            className="text-white line-clamp-1 leading-tight text-xl"
          >
            {balance.name}
          </Typography>
        </div>

        {/* 2. Remaining Value */}
        <div className="flex flex-col items-center py-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex items-baseline gap-2 translate-x-1">
            <Typography
              variant="h1"
              className="text-7xl text-white tabular-nums font-black drop-shadow-md"
            >
              {balance.currentBalance.toLocaleString()}
            </Typography>
            <Typography variant="h2" className="text-white/80 font-bold">
              ₪
            </Typography>
          </div>
          <Typography
            variant="caption"
            className="text-white/60 font-medium mt-1"
          >
            {t("vouchers.card.remainingLabel")}
          </Typography>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="shrink-0 flex flex-col items-end backdrop-blur-md px-4 py-2.5 rounded-2xl   bg-black/10 border border-white/5">
            <Typography
              variant="caption"
              size="small"
              className="text-white/90 font-bold tabular-nums"
            >
              {t("vouchers.card.validUntil")} {balance.validUntil || "MM/YY"}
            </Typography>
          </div>
          <div className="flex-1">
            {isActive ? (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.();
                }}
                className="py-3 px-5 w-full rounded-2xl bg-white text-primary hover:bg-white/90 active:scale-95 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Typography variant="body" className="font-bold">
                  {t("vouchers.card.detailsCta")}
                </Typography>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            ) : (
              <div className="h-12" />
            )}
          </div>
        </div>
      </div>

      {/* Status Overlays */}
      {status === VOUCHER_STATUS.REDEEMED && (
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.5] flex items-center justify-center pointer-events-none z-10">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 -rotate-12">
            <Typography
              variant="h2"
              className="text-white font-black uppercase tracking-tighter"
            >
              {t("vouchers.card.fullyUsed")}
            </Typography>
          </div>
        </div>
      )}

      {status === VOUCHER_STATUS.EXPIRED && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10">
          <div className="bg-error/20 backdrop-blur-md px-6 py-2 rounded-full border border-error/30 -rotate-12">
            <Typography
              variant="h2"
              className="text-white font-black uppercase tracking-tighter"
            >
              {t("vouchers.card.expired")}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
