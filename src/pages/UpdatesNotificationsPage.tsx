import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { SegmentedTabs } from "../components/ui/SegmentedTabs.tsx";
import { cn } from "../utils/cn.utils.ts";
import {
  MOCK_NOTIFICATIONS,
  type NotificationCategory,
  type NotificationItem,
} from "../mocks/notifications.mock.ts";
import { MOCK_VOUCHERS } from "../mocks/vouchers.mock.ts";

const ICONS: Record<string, typeof Bell> = {
  notif_1: Clock3,
  notif_2: Bell,
  notif_3: Bell,
  notif_4: Clock3,
  notif_5: CheckCircle2,
  notif_6: XCircle,
  notif_7: Bell,
};

export function UpdatesNotificationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationCategory>("updates");

  const voucherMap = useMemo(
    () => new Map(MOCK_VOUCHERS.map((voucher) => [voucher.id, voucher])),
    [],
  );

  const tabs = [
    {
      key: "updates" as const,
      label: t("vouchers.notifications.tabs.updates"),
    },
    {
      key: "alerts" as const,
      label: t("vouchers.notifications.tabs.alerts"),
    },
  ];

  const notifications = useMemo(
    () => MOCK_NOTIFICATIONS.filter((item) => item.category === activeTab),
    [activeTab],
  );

  const badgeLabel = (category: NotificationCategory) =>
    category === "updates"
      ? t("vouchers.notifications.badges.update")
      : t("vouchers.notifications.badges.alert");

  return (
    <Container className="flex flex-col h-full" noPadding>
      <div className="px-4 pt-4 pb-3">
        <Typography variant="h1" size="large" className="font-black">
          {t("vouchers.notifications.title")}
        </Typography>
        <Typography variant="body" className="text-gray mt-1">
          {t("vouchers.notifications.subtitle")}
        </Typography>

        <div className="mt-4">
          <SegmentedTabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            density="compact"
          />
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 flex flex-col gap-3 overflow-y-auto min-h-0">
        {notifications.length === 0 ? (
          <Surface variant="muted" className="p-8 rounded-3xl text-center">
            <Typography variant="h2" className="font-black">
              {t("vouchers.notifications.emptyTitle")}
            </Typography>
            <Typography variant="body" className="mt-2">
              {t("vouchers.notifications.emptySubtitle")}
            </Typography>
          </Surface>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              badgeLabel={badgeLabel(item.category)}
              voucherName={
                item.voucherId
                  ? voucherMap.get(item.voucherId)?.name
                  : undefined
              }
              icon={ICONS[item.id] ?? Bell}
              onClick={() =>
                navigate({
                  to: "/notifications/$notificationId",
                  params: { notificationId: item.id },
                })
              }
            />
          ))
        )}
      </div>
    </Container>
  );
}

function NotificationCard({
  item,
  badgeLabel,
  voucherName,
  icon: Icon,
  onClick,
}: {
  item: NotificationItem;
  badgeLabel: string;
  voucherName?: string;
  icon: typeof Bell;
  onClick: () => void;
}) {
  const [dateLabel, timeLabel] = item.date.split(" ");

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-start p-4 rounded-2xl border transition-all",
        item.read
          ? "bg-white border-border hover:border-primary/40"
          : "bg-primary/5 border-primary/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
            item.category === "alerts"
              ? "bg-error/10 text-error"
              : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Typography variant="body" className="font-bold text-gray-main">
                {item.title}
              </Typography>
              {!item.read && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold",
                item.category === "alerts"
                  ? "bg-error/10 text-error"
                  : "bg-primary/10 text-primary",
              )}
            >
              {badgeLabel}
            </span>
          </div>

          <Typography variant="body" className="text-gray">
            {item.description}
          </Typography>

          <div className="flex items-center justify-between gap-4">
            <Typography
              variant="caption"
              size="medium"
              className="text-gray-main"
            >
              {dateLabel} · {timeLabel}
            </Typography>
            {voucherName && (
              <Typography
                variant="caption"
                size="medium"
                className="text-primary font-semibold truncate"
              >
                {voucherName}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
