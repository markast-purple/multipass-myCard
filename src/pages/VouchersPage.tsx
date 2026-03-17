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
import { Receipt, History as HistoryIcon } from "lucide-react";
import { useVoucherStore } from "../store/voucherStore.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Container } from "../components/ui/Container.tsx";
import { HistoryItem } from "../components/history/HistoryItem.tsx";
import { SegmentedTabs } from "../components/ui/SegmentedTabs.tsx";

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
  const activeVoucherId = vouchers[expandedIndex]?.id;
  const filteredHistory = activeVoucherId
    ? history.filter((item) => item.voucherId === activeVoucherId)
    : [];
  const displayedHistory = filteredHistory.slice(0, 2);

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
        <SegmentedTabs
          tabs={TABS.map((tab) => ({
            key: tab,
            label: t(`vouchers.tabs.${tab}`),
          }))}
          value={activeTab}
          onChange={onTabChange}
        />
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
              className="text-gray font-medium text-center"
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
              <Typography variant="h2" className="text-gray-main font-bold">
                {t(`vouchers.empty.${activeTab}`)}
              </Typography>
              <Typography variant="body" className="text-gray max-w-[240px]">
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
            <Typography variant="h2" className="text-gray-main">
              {t("vouchers.redemptionHistory")}
            </Typography>
          </div>

          <div className="flex flex-col">
            {filteredHistory.length === 0 ? (
              <Surface variant="muted" className="p-6 rounded-2xl text-center">
                <Typography variant="h2" className="font-black">
                  {t("vouchers.history.emptyTitle")}
                </Typography>
                <Typography variant="body" className="mt-2">
                  {t("vouchers.history.emptySubtitle")}
                </Typography>
              </Surface>
            ) : (
              <>
                {displayedHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn("flex flex-col", index !== 0 && "pt-2")}
                  >
                    <Typography
                      variant="caption"
                      size="medium"
                      className="uppercase text-gray-main truncate pb-2"
                    >
                      {item.date.split(" ")[0]}
                    </Typography>
                    <HistoryItem
                      item={item}
                      onClick={() =>
                        navigate({
                          to: "/history/$redemptionId",
                          params: { redemptionId: item.id },
                        })
                      }
                    />
                  </div>
                ))}

                {filteredHistory.length > 2 && (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate({ to: "/history" })}
                    className="mt-6 py-4"
                  >
                    {t("vouchers.showAll")}
                  </Button>
                )}
              </>
            )}
          </div>
        </Surface>
      </div>
    </Container>
  );
}
