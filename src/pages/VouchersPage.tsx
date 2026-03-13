import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
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
import { useVoucherStore } from "../store/voucherStore.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Container } from "../components/ui/Container.tsx";

const TABS: VoucherStatus[] = [
  VOUCHER_STATUS.ACTIVE,
  VOUCHER_STATUS.REDEEMED,
  VOUCHER_STATUS.EXPIRED,
];

const COLLAPSED_H = 100;
const OVERLAP = 40;
const DECK_OFFSET = 20;
const STACKED_H = 55;

export function VouchersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vouchers, activeTab, isLoading, isError, refetch, handleTabChange } =
    useVouchersPage();
  const setActiveColorIndex = useVoucherStore(
    (state) => state.setActiveColorIndex,
  );

  const [expandedIdxState, setExpandedIdxState] = useState<number | null>(null);
  const expandedIndex =
    expandedIdxState !== null
      ? Math.min(expandedIdxState, Math.max(0, vouchers.length - 1))
      : Math.max(0, vouchers.length - 1);

  const [stackActive, setStackActive] = useState(false);

  const [expandedCardHeight, setExpandedCardHeight] = useState(220);
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
    <Container className="flex flex-col min-h-full" noPadding>
      <div className="z-40 px-4 pt-4 pb-2">
        <Surface
          variant="muted"
          className="flex gap-1 p-1 rounded-xl border border-border"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg transition-all duration-200",
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-slightly-black hover:text-full-dark active:bg-gray-200",
              )}
            >
              <Typography
                variant="small"
                className="font-semibold text-inherit"
              >
                {t(`vouchers.tabs.${tab}`)}
              </Typography>
            </button>
          ))}
        </Surface>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div
            className="w-[90%] mx-auto relative"
            style={{ height: expandedCardHeight + 2 * DECK_OFFSET }}
          >
            {[0, 1, 2].map((i) => {
              const depthFromFront = 2 - i;
              return (
                <Surface
                  key={i}
                  variant="muted"
                  className="absolute left-0 right-0 animate-pulse border border-border shadow-sm"
                  style={{
                    top: i * DECK_OFFSET,
                    height: expandedCardHeight,
                    zIndex: i + 1,
                    transform: `scale(${1 - depthFromFront * 0.04})`,
                    transformOrigin: "bottom center",
                    opacity: 1 - depthFromFront * 0.18,
                  }}
                />
              );
            })}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
            <Typography
              variant="body"
              className="text-slightly-black font-medium text-center"
            >
              {t("vouchers.error.title")}
            </Typography>
            <Button onClick={() => refetch()} variant="primary">
              {t("vouchers.error.retry")}
            </Button>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-8 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <Receipt className="h-10 w-10 text-slightly-black/40" />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <Typography variant="h2" className="text-full-dark font-bold">
                {t(`vouchers.empty.${activeTab}`)}
              </Typography>
              <Typography
                variant="body"
                className="text-slightly-black max-w-[240px]"
              >
                {t("vouchers.subtitle")}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            <div
              className="w-[90%] mx-auto h-full flex flex-col"
              onClick={() => {
                if (stackActive) return;
                openStack();
              }}
            >
              {vouchers.map((v: any, i: number) => {
                const isExpanded = i === expandedIndex;
                const marginTop = i > 0 ? -OVERLAP : 0;
                const zIndex = n - Math.abs(i - expandedIndex);
                const scale = 1 - Math.abs(i - expandedIndex) * 0.04;
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
                      height: !isExpanded
                        ? !stackActive
                          ? STACKED_H
                          : COLLAPSED_H
                        : "auto",
                      scale: !stackActive ? scale : 1,
                    }}
                    onClick={
                      stackActive && !isExpanded
                        ? () => setExpandedIdxState(i)
                        : undefined
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
                        isStacked={stackActive}
                        isAbove={i < expandedIndex}
                        onAction={
                          isExpanded
                            ? () => {
                                setActiveColorIndex(i);
                                navigate({
                                  to: "/vouchers/$voucherId",
                                  params: { voucherId: v.id },
                                });
                              }
                            : undefined
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Redemption history ─── */}
        <Surface className="mt-4 px-4 pb-8 flex flex-col gap-4 rounded-t-3xl pt-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <HistoryIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <Typography variant="h2" className="text-full-dark">
              {t("vouchers.redemptionHistory")}
            </Typography>
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
                      <Typography
                        variant="caption"
                        className="font-black text-full-dark"
                      >
                        {displayDate}
                      </Typography>
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
                      <Receipt className="h-5 w-5 text-slightly-black/50" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex justify-between items-start">
                        <Typography
                          variant="body"
                          className="font-bold leading-tight"
                        >
                          {item.provider}
                        </Typography>
                        <div className="flex flex-col items-end gap-1">
                          <Typography variant="h2" className="leading-none">
                            ₪{item.amount.toLocaleString()}
                          </Typography>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                item.status === "success"
                                  ? "bg-success"
                                  : "bg-error",
                              )}
                            />
                            <Typography
                              variant="caption"
                              className={cn(
                                "font-bold",
                                item.status === "success"
                                  ? "text-success"
                                  : "text-error",
                              )}
                            >
                              {t(`vouchers.status.${item.status}`)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="caption"
                          className="text-slightly-black font-medium"
                        >
                          {displayTime}
                        </Typography>
                        {item.location && (
                          <div className="flex items-center gap-1 text-slightly-black/60">
                            <MapPin className="h-3 w-3" />
                            <Typography
                              variant="caption"
                              className="font-medium"
                            >
                              {item.location}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {!showAllHistory && history.length > 4 && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowAllHistory(true)}
                className="mt-6 py-4"
              >
                {t("vouchers.showMore")}
              </Button>
            )}
            {showAllHistory && (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowAllHistory(false)}
                className="mt-4 text-slightly-black"
              >
                {t("vouchers.showLess")}
              </Button>
            )}
          </div>
        </Surface>
      </div>
    </Container>
  );
}
