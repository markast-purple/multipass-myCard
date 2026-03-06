import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Calendar, Info, Wallet, CheckCircle2 } from "lucide-react";
import { useBalances } from "../hooks/useBalances.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Container } from "../components/ui/Container.tsx";

export function VoucherDetailsPage() {
  const { t } = useTranslation();
  const { voucherId } = useParams({ from: "/(main)/vouchers/$voucherId/" });
  const navigate = useNavigate();
  const { data: balancesData, isLoading } = useBalances();

  const voucher = balancesData?.balances?.find((b: any) => b.id === voucherId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
        <Typography variant="h2" className="mb-2">
          {t("vouchers.details.notFound")}
        </Typography>
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-primary font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          {t("vouchers.details.backToList")}
        </button>
      </div>
    );
  }

  const remaining = voucher.currentBalance;
  const isActive = remaining > 0;

  return (
    <div className="px-3 pt-2 shadow-2xl pb-6">
      <Container
        className="flex flex-1 flex-col rounded-3xl gap-6 pb-6 border-slate-100 border bg-slate-50 px-3"
        noPadding
      >
        {/* Brand-focused Header Section */}
        <div className="pt-4">
          <Typography
            variant="caption"
            className="text-white/70 font-black tracking-[0.2em] text-[10px] uppercase"
          >
            {voucher.provider || voucher.companies?.[0]}
          </Typography>
          <Typography variant="h1" className="text-4xl font-black">
            {voucher.name}
          </Typography>
        </div>

        {/* Main Content Section */}
        <div className="z-20 flex flex-col gap-6">
          {/* Hero Balance Card - Primary Theme */}
          <Surface
            className="p-8 flex flex-col items-center gap-3 border border-white/10 shadow-2xl overflow-hidden bg-primary text-white"
            variant="primary"
          >
            <Typography
              variant="caption"
              className="text-white/80 font-bold text-[11px] uppercase tracking-wider"
            >
              {t("vouchers.card.remainingLabel")}
            </Typography>

            <div className="flex items-baseline gap-2 translate-x-1">
              <Typography
                variant="h1"
                className="text-7xl font-black text-white tabular-nums"
              >
                {remaining.toLocaleString()}
              </Typography>
              <Typography
                variant="h2"
                className="text-3xl text-white font-bold opacity-90"
              >
                ₪
              </Typography>
            </div>

            <div className="w-full mt-4 flex flex-col gap-2">
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden p-px">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  style={{
                    width: `${(remaining / voucher.allocation) * 100}%`,
                  }}
                />
              </div>
              <Typography
                variant="small"
                className="text-white/80 text-center font-bold text-[10px] uppercase tracking-wide"
              >
                {t("vouchers.card.usage", {
                  used: voucher.allocation - remaining,
                  total: voucher.allocation,
                })}
              </Typography>
            </div>
          </Surface>

          <div className="flex flex-col gap-2">
            {isActive ? (
              <>
                <Button
                  onClick={() =>
                    navigate({
                      to: "/vouchers/$voucherId/redeem",
                      params: { voucherId },
                    })
                  }
                  variant="primary"
                  className="w-full py-5 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all bg-primary text-white"
                >
                  <CheckCircle2 className="h-6 w-6" />
                  {t("vouchers.card.redeemCta")}
                </Button>
                <Typography
                  variant="small"
                  className="text-center font-bold text-slate-400 text-[11px] uppercase tracking-tighter"
                >
                  {t("vouchers.details.supportingHint")}
                </Typography>
              </>
            ) : (
              <Button
                onClick={() => navigate({ to: "/" })}
                variant="secondary"
                fullWidth
                className="py-5 rounded-2xl text-xl font-bold active:scale-[0.98] transition-all"
              >
                {t("common.back")}
              </Button>
            )}
          </div>
          <div className="border-t border-slate-100 flex flex-col gap-4">
            {isActive && (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                <Typography
                  variant="small"
                  className="font-bold text-primary text-[12px]"
                >
                  {t("vouchers.details.usageHint")}
                </Typography>
              </div>
            )}
          </div>
          {/* Info Rows */}
          <div className="flex gap-3">
            <Surface
              className="p-5 flex flex-1 items-center justify-between border border-slate-200 shadow-sm bg-white"
              variant="paper"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="caption"
                    className="text-slate-400 font-bold text-[10px]"
                  >
                    {t("vouchers.card.validUntil")}
                  </Typography>
                  <Typography
                    variant="h2"
                    className="text-lg font-black text-slate-800"
                  >
                    {voucher.validUntil || "MM/YY"}
                  </Typography>
                </div>
              </div>
            </Surface>

            <Surface
              className="p-5 flex flex-1 items-center justify-between border border-slate-200 shadow-sm bg-white"
              variant="paper"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="caption"
                    className="text-slate-400 font-bold text-[10px]"
                  >
                    {t("vouchers.card.amountLabel")}
                  </Typography>
                  <div className="flex items-baseline gap-1">
                    <Typography
                      variant="h2"
                      className="text-lg font-black text-slate-800 tabular-nums"
                    >
                      {voucher.allocation.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body"
                      className="text-xs font-bold text-slate-500"
                    >
                      ₪
                    </Typography>
                  </div>
                </div>
              </div>
            </Surface>
          </div>
          <div>
            {voucher.description && (
              <Surface
                className="p-5 flex flex-col gap-2 border border-slate-200 shadow-sm bg-white"
                variant="paper"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Info className="h-5 w-5" />
                  </div>
                  <Typography
                    variant="h2"
                    size="medium"
                    className="text-slate-800 font-black uppercase"
                  >
                    {t("vouchers.details.description")}
                  </Typography>
                </div>
                <Typography
                  variant="body"
                  size="medium"
                  className="text-slate-600 font-medium leading-relaxed"
                >
                  {voucher.description}
                </Typography>
              </Surface>
            )}
          </div>
        </div>

        {/* Primary Footer Section (Non-sticky) */}
      </Container>
    </div>
  );
}
