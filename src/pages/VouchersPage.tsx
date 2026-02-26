import { useTranslation } from "react-i18next";
import { useState, useMemo, useRef, useCallback } from "react";
import { useBalances } from "../hooks/useBalances.ts";
import { VoucherCard, type VoucherStatus } from "../components/VoucherCard.tsx";
import { cn } from "../utils/cn.utils.ts";

const TABS: VoucherStatus[] = ["active", "redeemed", "expired"];

export function VouchersPage() {
  const { t, i18n } = useTranslation();
  const { data: balancesData, isLoading, isError, refetch } = useBalances();
  const [activeTab, setActiveTab] = useState<VoucherStatus>("active");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.dir() === "rtl";

  const vouchers = useMemo(() => {
    if (!balancesData?.balances) return [];

    return balancesData.balances.filter((balance: any) => {
      if (activeTab === "active") return balance.currentBalance > 0;
      if (activeTab === "redeemed")
        return (
          balance.currentBalance < balance.allocation &&
          balance.currentBalance >= 0
        );
      if (activeTab === "expired") return balance.currentBalance === 0;
      return true;
    });
  }, [balancesData, activeTab]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || vouchers.length === 0) return;

    const scrollLeft = Math.abs(container.scrollLeft);
    const cardWidth = container.scrollWidth / vouchers.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, vouchers.length - 1));
  }, [vouchers.length]);

  const handleTabChange = (tab: VoucherStatus) => {
    setActiveTab(tab);
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
    }
  };

  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / vouchers.length;
    const scrollTo = cardWidth * index;
    container.scrollTo({
      left: isRtl ? -scrollTo : scrollTo,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="sticky top-0 bg-white z-40 px-4 pt-4 pb-2">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === tab
                  ? "bg-[#1a5c5c] text-white shadow-sm"
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
          <div className="flex gap-4 px-4 overflow-hidden">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse shrink-0"
                style={{ width: "85%" }}
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="flex justify-center py-4">
                    <div className="h-12 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-gray-100 border-t border-gray-200" />
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
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 items-stretch"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {vouchers.map((balance: any) => (
                <div
                  key={balance.id}
                  className="shrink-0 snap-center flex"
                  style={{ width: vouchers.length === 1 ? "100%" : "85%" }}
                >
                  <VoucherCard
                    balance={balance}
                    status={activeTab}
                    className="flex-1"
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
                        ? "bg-[#1a5c5c] scale-110"
                        : "bg-gray-300",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
