import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { VOUCHER_STATUS } from "../components/VoucherCard.tsx";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Copy, Share2, Info, AlertTriangle } from "lucide-react";
import { useBalances } from "../hooks/useBalances.ts";
import { Typography } from "../components/ui/Typography.tsx";

export function RedeemPage() {
  const { t } = useTranslation();
  const { voucherId } = useParams({
    from: "/(main)/vouchers/$voucherId/redeem",
  });
  const navigate = useNavigate();
  const { data: balancesData, refetch } = useBalances();

  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  const initialQtyRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const voucher = balancesData?.balances?.find((b: any) => b.id === voucherId);
  // In a real app, this would be a single-use token or state-dependent code
  const numericCode = "8429 1035 7621";

  useEffect(() => {
    if (voucher && initialQtyRef.current === null) {
      initialQtyRef.current = voucher.currentBalance;
    }
  }, [voucher]);

  useEffect(() => {
    if (!isPolling) return;

    pollIntervalRef.current = window.setInterval(() => {
      refetch();
    }, 10000);

    timeoutRef.current = window.setTimeout(() => {
      setIsPolling(false);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }, 90000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPolling, refetch]);

  useEffect(() => {
    if (
      voucher &&
      initialQtyRef.current !== null &&
      voucher.currentBalance < initialQtyRef.current
    ) {
      setSuccess(true);
      setIsPolling(false);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [voucher]);

  const handleCopy = () => {
    navigator.clipboard.writeText(numericCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!voucher) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!success ? (
        <div className="flex flex-col flex-1 px-6 py-4 gap-4 max-w-md mx-auto w-full">
          {/* Moment-of-truth Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Typography
              variant="h1"
              className="text-3xl font-black text-slate-900 mt-2"
            >
              {t("vouchers.redeem.presentToCashier")}
            </Typography>
            <Typography variant="body" className="text-slate-500 font-medium">
              {voucher.name}
            </Typography>
          </div>

          {/* Code Container - Clean Whitespace */}
          <div className="flex flex-col gap-4 items-center py-2">
            <div className="p-8 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex items-center justify-center relative overflow-hidden group">
              {/* Decorative background blur */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative p-2 bg-white rounded-2xl">
                <QRCodeSVG
                  value={numericCode}
                  size={200}
                  level="H"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex flex-col items-center gap-2">
                <Typography
                  variant="caption"
                  className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]"
                >
                  {t("vouchers.redeem.redeemCode")}
                </Typography>
                <Typography className="text-3xl font-mono font-black tracking-[0.15em] text-slate-900 tabular-nums">
                  {numericCode}
                </Typography>
              </div>

              {/* Enhanced Labeled Actions */}
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-4xl hover:bg-slate-100 active:scale-95 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white border border-slate-100 text-slate-600 shadow-sm"}`}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <Typography
                    variant="small"
                    className={`font-bold uppercase tracking-wide ${copied ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    {copied ? t("common.copied") : t("common.copy")}
                  </Typography>
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-4xl hover:bg-slate-100 active:scale-95 transition-all group">
                  <div className="w-10 h-10 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                    <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <Typography
                    variant="small"
                    className="font-bold uppercase tracking-wide text-[11px] text-slate-500"
                  >
                    {t("vouchers.redeem.share")}
                  </Typography>
                </button>
              </div>
            </div>
          </div>

          {/* Safety & Info Messaging */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <Typography
                  variant="small"
                  className="font-black text-amber-900 uppercase tracking-wide text-[11px]"
                >
                  {t("common.important")}
                </Typography>
                <Typography
                  variant="body"
                  className="text-amber-800 text-sm leading-snug font-medium"
                >
                  {t("vouchers.redeem.doNotShare")}
                </Typography>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-2">
              <Info className="h-4 w-4 text-slate-300" />
              <Typography
                variant="small"
                className="text-slate-400 font-bold text-[12px]"
              >
                {t("vouchers.card.validUntil")}: {voucher.validUntil || "MM/YY"}
              </Typography>
            </div>

            {!isPolling && (
              <button
                onClick={() => setIsPolling(true)}
                className="w-full py-5 bg-primary text-white rounded-4xl font-black text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all mt-4"
              >
                {t("vouchers.redeem.tryAgain")}
              </button>
            )}

            <button
              onClick={() => navigate({ to: ".." })}
              className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
            >
              {t("vouchers.redeem.backToDetails")}
            </button>
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
              className="text-3xl font-black text-slate-900 mb-4 tracking-tight"
            >
              {t("vouchers.redeem.success")}
            </Typography>
            <Typography
              variant="body"
              className="text-slate-500 font-medium leading-relaxed"
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
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-5 rounded-4xl font-bold text-lg border border-slate-100 active:scale-[0.98] transition-all"
            >
              {t("vouchers.redeem.backToActive")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
