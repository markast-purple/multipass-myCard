import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { Container } from "../components/ui/Container.tsx";
import { SegmentedTabs } from "../components/ui/SegmentedTabs.tsx";
import { useRedemptionsHistory } from "../hooks/useRedemptionsHistory.ts";
import {
  REDEMPTIONS_HISTORY_FILTER,
  type RedemptionsHistoryFilterKey,
} from "../constants/redemptionsHistory.constant.ts";
import { HistoryItem } from "../components/history/HistoryItem.tsx";
import { BottomSheet } from "../components/ui/BottomSheet.tsx";
import { Button } from "../components/ui/Button.tsx";
import { cn } from "../utils/cn.utils.ts";
import { DatePicker } from "../components/ui/DatePicker.tsx";

export function RedemptionsHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const filterTabs: { key: RedemptionsHistoryFilterKey; label: string }[] = [
    {
      key: REDEMPTIONS_HISTORY_FILTER.ALL,
      label: t("vouchers.history.filters.all"),
    },
    {
      key: REDEMPTIONS_HISTORY_FILTER.COMPLETED,
      label: t("vouchers.history.filters.completed"),
    },
    {
      key: REDEMPTIONS_HISTORY_FILTER.FAILED,
      label: t("vouchers.history.filters.failed"),
    },
    {
      key: REDEMPTIONS_HISTORY_FILTER.REFUNDED,
      label: t("vouchers.history.filters.refunded"),
    },
  ];

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<string[]>([]);
  const [isVoucherSheetOpen, setIsVoucherSheetOpen] = useState(false);

  const {
    filter,
    setFilter,
    query,
    setQuery,
    groups,
    history,
  } = useRedemptionsHistory({
    filterTabs,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    selectedVoucherIds,
  });

  const vouchersWithTransactions = useMemo(() => {
    const map = new Map<string, string>();
    history.forEach((item) => {
      if (!map.has(item.voucherId)) {
        map.set(item.voucherId, item.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [history]);

  return (
    <Container className="flex flex-col h-full min-h-0" noPadding>
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Surface
            variant="muted"
            className="flex-1 p-3 rounded-2xl border border-border"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("vouchers.history.searchPlaceholder")}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </Surface>
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="h-12 w-12 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-primary hover:brightness-95 transition-all"
            aria-label={t("vouchers.history.filters.button")}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 flex flex-col mt-2 gap-10 overflow-y-auto min-h-0">
        {groups.length === 0 ? (
          <Surface variant="muted" className="p-8 rounded-3xl text-center">
            <Typography variant="h2" className="font-black">
              {t("vouchers.history.emptyTitle")}
            </Typography>
            <Typography variant="body" className="mt-2">
              {t("vouchers.history.emptySubtitle")}
            </Typography>
          </Surface>
        ) : (
          groups.map((group) => (
            <div
              key={`${group.key}:${group.dateLabel ?? ""}`}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <Typography
                    variant="caption"
                    size="medium"
                    className="uppercase text-gray-main truncate"
                  >
                    {group.key === "today"
                      ? t("vouchers.history.groups.today")
                      : group.key === "yesterday"
                        ? t("vouchers.history.groups.yesterday")
                        : group.dateLabel}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {group.items.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onClick={() =>
                      navigate({
                        to: "/history/$redemptionId",
                        params: { redemptionId: item.id },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomSheet
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title={t("vouchers.history.filters.title")}
        zIndexBase={1000}
      >
        <div className="flex flex-col gap-5 text-base">
          <div className="flex flex-col gap-3">
            <Typography variant="body" className="text-gray-main font-bold">
              {t("vouchers.history.filters.statusLabel")}
            </Typography>
            <SegmentedTabs
              tabs={filterTabs}
              value={filter}
              onChange={setFilter}
              density="compact"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Typography variant="body" className="text-gray-main font-bold">
              {t("vouchers.history.filters.date")}
            </Typography>
            <div className="flex items-center justify-between text-sm text-gray">
              <span>{t("vouchers.history.filters.range")}</span>
              <button
                className="font-semibold text-primary hover:underline"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                {t("vouchers.history.filters.clear")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DatePicker
                value={dateFrom}
                onChange={setDateFrom}
                label={t("vouchers.history.filters.from")}
                zIndexBase={1400}
              />
              <DatePicker
                value={dateTo}
                onChange={setDateTo}
                label={t("vouchers.history.filters.to")}
                zIndexBase={1400}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Typography variant="body" className="text-gray-main font-bold">
              {t("vouchers.history.filters.amount")}
            </Typography>
            <div className="flex items-center justify-between text-sm text-gray">
              <span>{t("vouchers.history.filters.amountRange")}</span>
              <button
                className="font-semibold text-primary hover:underline"
                onClick={() => {
                  setAmountMin("");
                  setAmountMax("");
                }}
              >
                {t("vouchers.history.filters.clear")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                inputMode="numeric"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder={t("vouchers.history.filters.min")}
                className={cn(
                  "w-full h-11 rounded-xl border border-border bg-white px-3 text-base",
                  "outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                )}
              />
              <input
                type="number"
                inputMode="numeric"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder={t("vouchers.history.filters.max")}
                className={cn(
                  "w-full h-11 rounded-xl border border-border bg-white px-3 text-base",
                  "outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="h-11 flex items-center justify-between gap-3 rounded-xl border border-border px-3 text-base text-gray-main"
              onClick={() => setIsVoucherSheetOpen(true)}
            >
              <span className="font-bold">
                {t("vouchers.history.filters.voucherName")}
              </span>
              <span className="text-sm text-gray">
                {selectedVoucherIds.length > 0
                  ? t("vouchers.history.filters.selected", {
                      count: selectedVoucherIds.length,
                    })
                  : t("vouchers.history.filters.voucherHint")}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3 text-base">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setFilter(REDEMPTIONS_HISTORY_FILTER.ALL);
              setDateFrom("");
              setDateTo("");
              setAmountMin("");
              setAmountMax("");
              setSelectedVoucherIds([]);
            }}
          >
            {t("vouchers.history.filters.reset")}
          </Button>
          <Button fullWidth onClick={() => setIsFiltersOpen(false)}>
            {t("vouchers.history.filters.apply")}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={isVoucherSheetOpen}
        onClose={() => setIsVoucherSheetOpen(false)}
        title={t("vouchers.history.filters.voucherName")}
        zIndexBase={1200}
      >
        <div className="flex items-center justify-between text-sm text-gray">
          <span>{t("vouchers.history.filters.voucherHint")}</span>
          <button
            className="font-semibold text-primary hover:underline"
            onClick={() => setSelectedVoucherIds([])}
          >
            {t("vouchers.history.filters.clear")}
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 text-base">
          {vouchersWithTransactions.map((voucher) => {
            const checked = selectedVoucherIds.includes(voucher.id);
            return (
              <label
                key={voucher.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-base"
              >
                <span className="text-gray-main font-medium">
                  {voucher.name}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedVoucherIds((prev) =>
                      prev.includes(voucher.id)
                        ? prev.filter((id) => id !== voucher.id)
                        : [...prev, voucher.id],
                    );
                  }}
                  className="h-4 w-4 rounded-sm checked:rounded-sm accent-primary"
                />
              </label>
            );
          })}
        </div>
        <div className="mt-6 flex gap-3 text-base">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setSelectedVoucherIds([])}
          >
            {t("vouchers.history.filters.clear")}
          </Button>
          <Button fullWidth onClick={() => setIsVoucherSheetOpen(false)}>
            {t("vouchers.history.filters.apply")}
          </Button>
        </div>
      </BottomSheet>
    </Container>
  );
}
