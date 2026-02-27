import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  VoucherCard,
  VOUCHER_STATUS,
  type VoucherStatus,
} from "../components/VoucherCard.tsx";
import { cn } from "../utils/cn.utils.ts";
import { useNavigate } from "@tanstack/react-router";
import { useVouchersPage } from "../hooks/useVouchersPage.ts";
import { useVoucherHistory } from "../hooks/useVoucherHistory.ts";
import { Receipt, History as HistoryIcon, MapPin } from "lucide-react";

const TABS: VoucherStatus[] = [
  VOUCHER_STATUS.ACTIVE,
  VOUCHER_STATUS.REDEEMED,
  VOUCHER_STATUS.EXPIRED,
];

export function VouchersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vouchers,
    activeTab,
    activeIndex,
    isLoading,
    isError,
    refetch,
    scrollRef,
    isRtl,
    handleScroll,
    handleTabChange,
    scrollToCard,
  } = useVouchersPage();

  const { history } = useVoucherHistory();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const displayedHistory = showAllHistory ? history : history.slice(0, 4);

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="bg-white z-40 px-4 pt-4 pb-2">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 active:bg-gray-200",
              )}
            >
              {t(`vouchers.tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center gap-4 px-4 overflow-hidden min-h-[300px]">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-[#2a5a6a]/30 animate-pulse shrink-0 bg-linear-to-br from-[#1a3a4a] to-[#0d2633]"
                style={{ width: "85%" }}
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="h-10 w-40 bg-white/10 rounded" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="flex justify-start py-4">
                    <div className="h-12 w-32 bg-white/20 rounded" />
                  </div>
                  <div className="flex">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-white/5 border-t flex items-center justify-center border-white/10">
                  <div className="h-4 w-28 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
            <p className="text-gray-500 text-lg font-medium">
              {t("vouchers.error.title")}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:brightness-110 transition-all active:scale-95"
            >
              {t("vouchers.error.retry")}
            </button>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-gray-400 text-lg font-medium">
              {t(`vouchers.empty.${activeTab}`)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              dir={isRtl ? "rtl" : "ltr"}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 items-center min-h-[300px]"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {vouchers.map((balance: any, index: number) => (
                <div
                  key={balance.id}
                  className="shrink-0 snap-center flex items-center transition-all duration-300 h-full py-4"
                  style={{ width: vouchers.length === 1 ? "100%" : "85%" }}
                >
                  <VoucherCard
                    balance={balance}
                    status={activeTab}
                    className="flex-1"
                    isFocused={index === activeIndex}
                    onAction={() =>
                      navigate({
                        to: "/vouchers/$voucherId",
                        params: { voucherId: balance.id },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            {vouchers.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {vouchers.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className={cn(
                      "w-2 h-2 rounded-sm transition-all duration-300 cursor-pointer",
                      index === activeIndex
                        ? "bg-primary scale-110"
                        : "bg-gray-300",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 px-4 pb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HistoryIcon
                  className="h-5 w-5 text-primary"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="font-bold text-slate-900">
                {t("vouchers.redemptionHistory")}
              </h3>
            </div>
          </div>

          <div className="flex flex-col">
            {displayedHistory.map((item, index) => {
              const displayDate = item.date.split(" ")[0];
              const displayTime = item.date.split(" ")[1];
              const isFirstInDate =
                index === 0 ||
                displayedHistory[index - 1].date.split(" ")[0] !== displayDate;

              return (
                <div key={item.id} className="flex flex-col">
                  {isFirstInDate && (
                    <div className="pt-4 pb-2">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                        {displayDate}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex gap-4 py-4 transition-all -mx-4 px-4",
                      index !== displayedHistory.length - 1 &&
                        !(
                          index < displayedHistory.length - 1 &&
                          displayedHistory[index + 1].date.split(" ")[0] !==
                            displayDate
                        ) &&
                        "border-b border-slate-100",
                    )}
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 self-stretch">
                      <Receipt className="h-5 w-5 text-slate-500" />
                    </div>

                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 leading-tight">
                          {item.provider}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-black text-xl text-slate-900 leading-none">
                            ₪{item.amount.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                item.status === "success"
                                  ? "bg-emerald-500"
                                  : "bg-rose-500",
                              )}
                            />
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                item.status === "success"
                                  ? "text-emerald-600"
                                  : "text-rose-600",
                              )}
                            >
                              {t(`vouchers.status.${item.status}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400">
                          {displayTime}
                        </span>
                        {item.location && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {item.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {!showAllHistory && history.length > 4 && (
              <button
                onClick={() => setShowAllHistory(true)}
                className="mt-6 py-3.5 w-full bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{t("vouchers.showMore")}</span>
              </button>
            )}

            {showAllHistory && (
              <button
                onClick={() => setShowAllHistory(false)}
                className="mt-4 py-3.5 w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                {t("vouchers.showLess")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
