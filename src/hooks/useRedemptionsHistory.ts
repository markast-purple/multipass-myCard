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
}: {
  filterTabs: SegmentedTab<RedemptionsHistoryFilterKey>[];
}) {
  const { history } = useVoucherHistory();

  const [filter, setFilter] = useState<RedemptionsHistoryFilterKey>(
    REDEMPTIONS_HISTORY_FILTER.ALL,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const allowed = new Set(filterToUiStatuses(filter));
    const q = query.trim().toLowerCase();

    return history.filter((item) => {
      const uiStatus = mapRedemptionStatus(item.status);
      if (!allowed.has(uiStatus)) return false;
      if (!q) return true;

      const hay = [item.provider, item.name, item.location ?? "", item.date]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [history, filter, query]);

  const groups = useMemo(() => groupRedemptionsByDate(filtered), [filtered]);

  const sectionTitleKey = (key: RedemptionGroupKey) => key;

  return {
    filterTabs,
    filter,
    setFilter,
    query,
    setQuery,
    groups,
    sectionTitleKey,
  };
}

