import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
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

  const { filter, setFilter, query, setQuery, groups } = useRedemptionsHistory({
    filterTabs,
  });

  return (
    <Container className="flex flex-col h-full min-h-0" noPadding>
      <div className="px-4 pt-4 pb-3 shrink-0">
        <Surface
          variant="muted"
          className="p-3 rounded-2xl border border-border"
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

        <div className="mt-3">
          <SegmentedTabs
            tabs={filterTabs}
            value={filter}
            onChange={setFilter}
            density="compact"
          />
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
    </Container>
  );
}
