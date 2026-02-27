import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Calendar,
  Info,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useBalances } from "../hooks/useBalances.ts";

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
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {t("vouchers.details.notFound")}
        </h2>
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-primary font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          {t("vouchers.details.backToList")}
        </button>
      </div>
    );
  }

  const remaining = voucher.currentBalance;
  const total = voucher.allocation;
  const isActive = remaining > 0;

  return (
    <div className="flex flex-col min-h-full">
      <div className="relative overflow-hidden bg-white pb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-emerald-50 to-transparent -mr-32 -mt-32 rounded-full opacity-60" />

        <div className="relative px-6 pt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-bold text-primary tracking-wide uppercase">
                {voucher.provider || voucher.companies?.[0]}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {voucher.name}
            </h1>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t("vouchers.card.amountLabel")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter tabular-nums text-slate-900">
                {voucher.allocation.toLocaleString()}
              </span>
              <span className="text-3xl font-bold text-slate-900">₪</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform active:scale-[0.99]">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">
                {t("vouchers.card.validUntil")}
              </span>
              <span className="text-lg font-bold text-slate-800">
                {voucher.validUntil}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform active:scale-[0.99]">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">
                {t("vouchers.card.remainingLabel")}
              </span>
              <span className="text-lg font-bold text-slate-800">
                {t("vouchers.card.remaining", { remaining, total })}
              </span>
            </div>
          </div>

          {voucher.description && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">
                  {t("vouchers.details.description")}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {voucher.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 bg-white sticky bottom-0">
        {isActive ? (
          <button
            onClick={() =>
              navigate({
                to: "/vouchers/$voucherId/redeem",
                params: { voucherId },
              })
            }
            className="group w-full bg-primary hover:bg-emerald-900 text-white py-5 rounded-4xl font-bold text-xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-xl shadow-emerald-900/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
            <CheckCircle2 className="h-6 w-6" />
            {t("vouchers.card.redeemCta")}
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-5 rounded-4xl font-bold text-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            {t("common.back")}
          </button>
        )}
      </div>
    </div>
  );
}
