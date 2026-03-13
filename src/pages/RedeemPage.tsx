import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { VOUCHER_STATUS } from "../components/VoucherCard.tsx";
import { CheckCircle2, Copy } from "lucide-react";
import { cn } from "../utils/cn.utils.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { useRedeemPage } from "../hooks/useRedeemPage.ts";
import { Container } from "@/components/ui/Container.tsx";
import { getCardColors } from "../utils/cardColors.utils.ts";

export function RedeemPage() {
  const { t } = useTranslation();
  const {
    voucher,
    numericCode,
    success,
    copied,
    handleCopy,
    navigate,
    activeColorIndex,
  } = useRedeemPage();

  if (!voucher) return null;

  const colors = getCardColors(activeColorIndex);

  return (
    <div className="flex flex-1 flex-col px-4">
      {!success ? (
        <div className="flex flex-col flex-1 px-6 py-4 gap-4 max-w-md mx-auto w-full">
          <Typography
            variant="h1"
            className="text-main-dark text-2xl font-semibold text-center"
          >
            {voucher.name}
          </Typography>

          <div className="flex flex-col gap-4 items-center py-2">
            <Container
              className="rounded-3xl py-8 border-transparent px-3 shadow-lg"
              style={{
                backgroundColor: colors.gradFrom,
                boxShadow: `0 0 7px ${colors.gradFrom}`,
              }}
              noPadding
            >
              <div className="flex flex-col items-center justify-center relative overflow-hidden gap-6 group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative p-6 shadow-lg shadow-slate-200/60 bg-white rounded-2xl">
                  <QRCodeSVG
                    value={numericCode}
                    size={170}
                    level="H"
                    className="w-full h-full"
                  />
                </div>

                <div className="mt-4 flex flex-col items-center bg-white p-6 rounded-2xl">
                  <Barcode
                    value={numericCode.replace(/\s/g, "")}
                    width={2}
                    height={60}
                    displayValue={false}
                    background="transparent"
                    lineColor="#000000"
                    margin={0}
                  />
                </div>
              </div>
            </Container>
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex flex-col items-center gap-2">
                <Typography
                  variant="caption"
                  className="text-slightly-black font-bold uppercase tracking-[0.2em] text-[11px]"
                >
                  {t("vouchers.redeem.redeemCode")}
                </Typography>
                <Typography className="text-3xl font-mono font-black tracking-[0.15em] text-full-dark tabular-nums">
                  {numericCode}
                </Typography>
              </div>

              <div className="w-full flex justify-center">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-300",
                    copied
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : "text-white active:scale-95",
                  )}
                  style={!copied ? { backgroundColor: colors.gradFrom } : {}}
                >
                  {copied ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                  <Typography
                    variant="small"
                    className={cn(
                      "font-bold uppercase tracking-widest",
                      copied ? "text-white" : "text-main-dark",
                    )}
                  >
                    {copied ? t("common.copied") : t("common.copy")}
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-32 h-32 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-[3rem] shadow-2xl shadow-emerald-500/20 flex items-center justify-center transform rotate-12 glow-emerald-500">
              <CheckCircle2 className="h-16 w-16 text-white -rotate-12" />
            </div>
          </div>

          <div className="text-center mt-12 max-w-xs">
            <Typography
              variant="h1"
              className="text-3xl font-black text-full-dark mb-4 tracking-tight"
            >
              {t("vouchers.redeem.success")}
            </Typography>
            <Typography
              variant="body"
              className="text-slightly-black font-medium leading-relaxed"
            >
              {t("vouchers.redeem.successDesc")}
            </Typography>
          </div>

          <div className="w-full flex flex-col gap-4 mt-16 max-w-sm">
            <button
              onClick={() =>
                navigate({
                  to: "/",
                  search: { status: VOUCHER_STATUS.REDEEMED },
                })
              }
              className="w-full bg-primary hover:opacity-90 text-white py-5 rounded-4xl font-black text-lg shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {t("vouchers.redeem.viewRedeemed")}
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full bg-slate-50 hover:bg-slate-100 text-main-dark py-5 rounded-4xl font-bold text-lg border border-slate-100 active:scale-[0.98] transition-all"
            >
              {t("vouchers.redeem.backToActive")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
