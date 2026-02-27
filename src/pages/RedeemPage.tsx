import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { VOUCHER_STATUS } from "../components/VoucherCard.tsx";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Copy, Share2 } from "lucide-react";
import { useBalances } from "../hooks/useBalances.ts";

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
    <div className="flex flex-col min-h-full bg-slate-50/50">
      {!success ? (
        <div className="flex flex-col flex-1 px-4 py-6 gap-6">
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              {voucher.provider}
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              {voucher.name}
            </h1>
          </div>

          <div className="flex flex-col gap-6 bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50/50 -ml-16 -mt-16 rounded-full" />

            <div className="relative flex flex-col items-center gap-8">
              <div className="group relative p-4 bg-white rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="w-48 h-48 bg-white rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-50">
                  <QRCodeSVG
                    value={numericCode}
                    size={176}
                    level="H"
                    includeMargin={false}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <div className="w-full h-20 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center gap-px">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-slate-900 shrink-0 rounded-[0.5px]"
                      style={{
                        width: `${(Math.sin(i * 5) > 0 ? 1 : 2) + (Math.cos(i * 3) > 0 ? 0 : 1)}px`,
                        opacity: 0.8 + Math.random() * 0.2,
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <span className="text-2xl font-mono font-black tracking-widest text-slate-900">
                    {numericCode}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied
                        ? t("common.copied")
                        : t("vouchers.redeem.copyCode")}
                    </button>
                    <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <div className="fex flex-col items-center gap-3 py-4"></div>

            {!isPolling && (
              <button
                onClick={() => setIsPolling(true)}
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-4xl font-bold text-lg shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all"
              >
                {t("vouchers.redeem.tryAgain")}
              </button>
            )}

            <button
              onClick={() => navigate({ to: ".." })}
              className="w-full py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              {t("vouchers.redeem.backToDetails")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-28 h-28 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 flex items-center justify-center transform rotate-12">
              <CheckCircle2 className="h-14 w-14 text-white -rotate-12" />
            </div>
          </div>

          <div className="text-center mt-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
              {t("vouchers.redeem.success")}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t("vouchers.redeem.successDesc")}
            </p>
          </div>

          <div className="w-full flex flex-col gap-4 mt-12">
            <button
              onClick={() =>
                navigate({
                  to: "/",
                  search: { status: VOUCHER_STATUS.REDEEMED },
                })
              }
              className="w-full bg-primary hover:bg-emerald-900 text-white py-5 rounded-4xl font-black text-lg shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all"
            >
              {t("vouchers.redeem.viewRedeemed")}
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-5 rounded-4xl font-bold text-lg active:scale-[0.98] transition-all"
            >
              {t("vouchers.redeem.backToActive")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
