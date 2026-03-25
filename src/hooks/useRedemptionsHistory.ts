import { useMemo, useState } from "react";
import { useVoucherHistory } from "./useVoucherHistory.ts";
import type { SegmentedTab } from "../components/ui/SegmentedTabs.tsx";
import {
  REDEMPTIONS_HISTORY_FILTER,
  type RedemptionsHistoryFilterKey,
} from "../constants/redemptionsHistory.constant.ts";
import {
  filterToUiStatuses,
  groupRedemptionsByDate,
  mapRedemptionStatus,
  type RedemptionGroupKey,
} from "../utils/history.utils.ts";

export function useRedemptionsHistory({
  filterTabs,
  dateFrom,
  dateTo,
  amountMin,
  amountMax,
  selectedVoucherIds,
}: {
  filterTabs: SegmentedTab<RedemptionsHistoryFilterKey>[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string;
  amountMax?: string;
  selectedVoucherIds?: string[];
}) {
  const { history } = useVoucherHistory();

  const [filter, setFilter] = useState<RedemptionsHistoryFilterKey>(
    REDEMPTIONS_HISTORY_FILTER.ALL,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const allowed = new Set(filterToUiStatuses(filter));
    const q = query.trim().toLowerCase();
    const selectedSet =
      selectedVoucherIds && selectedVoucherIds.length > 0
        ? new Set(selectedVoucherIds)
        : null;
    const minAmount = amountMin ? Number(amountMin) : null;
    const maxAmount = amountMax ? Number(amountMax) : null;
    const fromDate = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null;

    return history.filter((item) => {
      const uiStatus = mapRedemptionStatus(item.status);
      if (!allowed.has(uiStatus)) return false;
      if (selectedSet && !selectedSet.has(item.voucherId)) return false;
      if (minAmount !== null && !Number.isNaN(minAmount)) {
        if (item.amount < minAmount) return false;
      }
      if (maxAmount !== null && !Number.isNaN(maxAmount)) {
        if (item.amount > maxAmount) return false;
      }
      if (fromDate || toDate) {
        const parsed = parseHistoryDate(item.date);
        if (parsed) {
          if (fromDate && parsed < fromDate) return false;
          if (toDate && parsed > toDate) return false;
        }
      }
      if (!q) return true;

      const hay = [item.provider, item.name, item.location ?? "", item.date]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [
    history,
    filter,
    query,
    amountMin,
    amountMax,
    dateFrom,
    dateTo,
    selectedVoucherIds,
  ]);

  const groups = useMemo(() => groupRedemptionsByDate(filtered), [filtered]);

  const sectionTitleKey = (key: RedemptionGroupKey) => key;

  return {
    filterTabs,
    filter,
    setFilter,
    query,
    setQuery,
    history,
    groups,
    sectionTitleKey,
  };
}

function parseHistoryDate(value: string) {
  // Expected format: "DD/MM/YYYY HH:mm"
  const [datePart, timePart] = value.split(" ");
  if (!datePart) return null;
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour = 0, minute = 0] = (timePart || "").split(":").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day, hour, minute);
}
