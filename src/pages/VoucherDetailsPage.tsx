import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Share2, ArrowLeftRight } from "lucide-react";
import { useBalances } from "../hooks/useBalances.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Container } from "../components/ui/Container.tsx";
import { getCardColors } from "../utils/cardColors.utils.ts";
import { useVoucherStore } from "../store/voucherStore.ts";

export function VoucherDetailsPage() {
  const { t } = useTranslation();
  const { voucherId } = useParams({ from: "/(main)/vouchers/$voucherId/" });
  const activeColorIndex = useVoucherStore((state) => state.activeColorIndex);
  const navigate = useNavigate();
  const { data: balancesData, isLoading } = useBalances();

  const voucher = balancesData?.balances?.find((b: any) => b.id === voucherId);
  const colors = getCardColors(activeColorIndex);

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
    <div className="px-3 flex-1 pb-6">
      <Container
        className="flex flex-1 flex-col rounded-3xl gap-6 pb-6 border-slate-100 border bg-slate-50 px-3"
        noPadding
      >
        <div className="pt-4">
          {voucher.provider ||
            (voucher.companies && voucher.companies.length > 0 && (
              <Typography
                variant="caption"
                className="text-white/70 font-black tracking-[0.2em] uppercase"
              >
                {voucher.provider || voucher.companies?.[0]}
              </Typography>
            ))}
          <Typography variant="h1" className="text-3xl font-black">
            {voucher.name}
          </Typography>
        </div>

        <div className="z-20 flex flex-col gap-4">
          <Surface
            className="p-8 flex flex-col items-center gap-3 border shadow-2xl overflow-hidden text-white rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
              borderColor: colors.border,
            }}
          >
            <Typography
              variant="caption"
              size="medium"
              className="text-white/80 font-bold uppercase"
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
                    backgroundColor: colors.border,
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
                  className="w-full py-5 rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-white border-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
                    boxShadow: `0 8px 15px -5px ${colors.glow}`,
                  }}
                >
                  <CheckCircle2 className="h-6 w-6" />
                  {t("vouchers.card.redeemCta")}
                </Button>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    className="w-full py-4 rounded-2xl text-xl font-black text-white border-0 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
                      boxShadow: `0 8px 15px -5px ${colors.glow}`,
                    }}
                    onClick={() =>
                      navigate({
                        to: "/vouchers/$voucherId/share",
                        params: { voucherId },
                      })
                    }
                  >
                    <Share2 className="h-5 w-5" />
                    {t("vouchers.share.tabs.share")}
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full py-4 rounded-2xl text-xl font-black text-white border-0 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all opacity-70 cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
                      boxShadow: `0 8px 15px -5px ${colors.glow}`,
                    }}
                    disabled
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                    {t("vouchers.share.tabs.transfer")}
                  </Button>
                </div>
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
        </div>

        {/* Primary Footer Section (Non-sticky) */}
      </Container>
    </div>
  );
}
