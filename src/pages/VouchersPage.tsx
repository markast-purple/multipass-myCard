import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import {
  VoucherCard,
  VOUCHER_STATUS,
  type VoucherStatus,
} from "../components/VoucherCard.tsx";
import { getCardColors } from "../utils/cardColors.utils.ts";
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

const COLLAPSED_H = 100;
const OVERLAP = 40;
const DECK_OFFSET = 20;

export function VouchersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vouchers, activeTab, isLoading, isError, refetch, handleTabChange } =
    useVouchersPage();

  const [expandedIdxState, setExpandedIdxState] = useState<number | null>(null);
  const expandedIndex =
    expandedIdxState !== null
      ? Math.min(expandedIdxState, Math.max(0, vouchers.length - 1))
      : Math.max(0, vouchers.length - 1);

  // Whether the stack is "open" (active accordion) or "closed" (deck view)
  const [stackActive, setStackActive] = useState(false);

  const [expandedCardHeight, setExpandedCardHeight] = useState(280);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  const { history } = useVoucherHistory();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const displayedHistory = showAllHistory ? history : history.slice(0, 4);

  useEffect(() => {
    const el = expandedCardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setExpandedCardHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [expandedIndex, vouchers]);

  // Reset to bottom (last) card + close stack when tab changes
  const onTabChange = (tab: VoucherStatus) => {
    setExpandedIdxState(null);
    setStackActive(false);
    handleTabChange(tab);
  };

  const openStack = (expandIdx?: number) => {
    setStackActive(true);
    if (expandIdx !== undefined) setExpandedIdxState(expandIdx);
  };

  const n = vouchers.length;

  return (
    <div className="flex flex-col min-h-full">
      <div className="z-40 px-4 pt-4 pb-2">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl border border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
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
        {/* ─── Loading ─── */}
        {isLoading ? (
          <div className="px-4 relative" style={{ height: 360 }}>
            {/* Skeleton collapsed strips */}
            {[0, 1].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 rounded-2xl animate-pulse bg-gray-200 border border-gray-300"
                style={{
                  top: i * (COLLAPSED_H - OVERLAP),
                  height: COLLAPSED_H,
                  zIndex: 2 - i,
                }}
              />
            ))}
            {/* Skeleton expanded card (last) */}
            <div
              className="absolute left-0 right-0 rounded-2xl animate-pulse bg-linear-to-br from-[#1a3a4a] to-[#0d2633] border border-[#2a5a6a]/30"
              style={{
                top: 2 * (COLLAPSED_H - OVERLAP),
                zIndex: 0,
                height: 240,
              }}
            >
              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between">
                  <div className="h-10 w-40 bg-white/10 rounded" />
                  <div className="h-4 w-20 bg-white/10 rounded" />
                </div>
                <div className="h-12 w-32 bg-white/20 rounded" />
                <div className="h-4 w-28 bg-white/10 rounded" />
              </div>
            </div>
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
          <div className="flex-1 flex flex-col gap-4">
            {/* ── INACTIVE: deck view ── */}
            {!stackActive && (
              <div
                className="w-[90%] mx-auto relative cursor-pointer"
                style={{ height: expandedCardHeight + (n - 1) * DECK_OFFSET }}
                onClick={() => openStack()}
              >
                {/* Ghost cards: stacked behind the main card, peeking from top */}
                {vouchers.slice(0, n - 1).map((_v: any, i: number) => {
                  const depthFromFront = n - 1 - i;
                  const colors = getCardColors(i);
                  return (
                    <div
                      key={i}
                      className="absolute left-0 right-0 rounded-3xl backdrop-blur-xl border"
                      style={{
                        top: i * DECK_OFFSET,
                        height: expandedCardHeight,
                        zIndex: i + 1,
                        background: `linear-gradient(135deg, ${colors.gradFrom}, ${colors.gradVia}, ${colors.gradTo})`,
                        borderColor: colors.border,
                        transform: `scale(${1 - depthFromFront * 0.04})`,
                        transformOrigin: "bottom center",
                        opacity: 1 - depthFromFront * 0.18,
                      }}
                    />
                  );
                })}

                {/* Front card (last index) — full content, at the bottom of the deck stack */}
                <div
                  ref={expandedCardRef}
                  className="absolute left-0 right-0"
                  style={{ top: (n - 1) * DECK_OFFSET, zIndex: n }}
                >
                  <VoucherCard
                    balance={vouchers[n - 1]}
                    status={activeTab}
                    colorIndex={n - 1}
                    onAction={() => openStack(n - 1)}
                  />
                </div>
              </div>
            )}

            {/* ── ACTIVE: accordion view ── */}
            {stackActive && (
              <div className="w-[90%] mx-auto h-full flex flex-col">
                {vouchers.map((v: any, i: number) => {
                  const isExpanded = i === expandedIndex;
                  // Use negative margin for all but the first card to create overlap
                  const marginTop = i > 0 ? -OVERLAP : 0;
                  const zIndex = n - Math.abs(i - expandedIndex);

                  return (
                    <div
                      key={v.id}
                      className={cn(
                        "relative transition-all duration-300 ease-in-out",
                        !isExpanded && "overflow-hidden cursor-pointer",
                      )}
                      style={{
                        marginTop,
                        zIndex,
                        height: !isExpanded ? COLLAPSED_H : "auto",
                      }}
                      onClick={
                        !isExpanded ? () => setExpandedIdxState(i) : undefined
                      }
                      aria-label={!isExpanded ? v.name : undefined}
                    >
                      <div
                        className="w-full h-full"
                        ref={isExpanded ? expandedCardRef : undefined}
                      >
                        <VoucherCard
                          balance={v}
                          status={activeTab}
                          colorIndex={i}
                          isCollapsed={!isExpanded}
                          isAbove={i < expandedIndex}
                          onAction={
                            isExpanded
                              ? () =>
                                  navigate({
                                    to: "/vouchers/$voucherId",
                                    params: { voucherId: v.id },
                                  })
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── Redemption history ─── */}
        <div className="mt-4 px-4 pb-8 flex flex-col gap-4 bg-white rounded-t-3xl pt-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HistoryIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-900">
              {t("vouchers.redemptionHistory")}
            </h3>
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
                      "flex gap-4 py-4 -mx-4 px-4",
                      index !== displayedHistory.length - 1 &&
                        !(
                          index < displayedHistory.length - 1 &&
                          displayedHistory[index + 1].date.split(" ")[0] !==
                            displayDate
                        ) &&
                        "border-b border-slate-100",
                    )}
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
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
