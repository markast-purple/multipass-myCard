import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { SegmentedTabs } from "../components/ui/SegmentedTabs.tsx";
import {
  MOCK_NOTIFICATIONS,
  type NotificationCategory,
  type NotificationItem,
} from "../mocks/notifications.mock.ts";

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

  const groups = useMemo(() => {
    const sorted = [...notifications].sort((a, b) =>
      a.date < b.date ? 1 : -1,
    );

    const groupMap = new Map<string, NotificationItem[]>();
    sorted.forEach((item) => {
      const dateKey = item.date.split(" ")[0];
      const items = groupMap.get(dateKey) ?? [];
      items.push(item);
      groupMap.set(dateKey, items);
    });

    return Array.from(groupMap.entries()).map(([dateKey, items]) => ({
      key: dateKey,
      label: dateKey,
      items,
    }));
  }, [notifications]);

  const dateLabel = (dateKey: string) => {
    const [day, month, year] = dateKey.split("/").map(Number);
    if (!day || !month || !year) return dateKey;
    const itemDate = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (itemDate.getTime() === today.getTime())
      return t("vouchers.history.groups.today");
    if (itemDate.getTime() === yesterday.getTime())
      return t("vouchers.history.groups.yesterday");
    return dateKey;
  };

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
          groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-3">
              <Typography
                variant="caption"
                size="medium"
                className="uppercase text-gray-main truncate"
              >
                {dateLabel(group.label)}
              </Typography>
              <div className="flex flex-col">
                {group.items.map((item, index) => (
                  <div key={item.id} className="flex flex-col">
                    <NotificationCard
                      item={item}
                      icon={ICONS[item.id] ?? Bell}
                      onClick={() =>
                        navigate({
                          to: "/notifications/$notificationId",
                          params: { notificationId: item.id },
                        })
                      }
                    />
                    {index < group.items.length - 1 && (
                      <div className="h-px bg-slate-100 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

function NotificationCard({
  item,
  icon: Icon,
  onClick,
}: {
  item: NotificationItem;
  icon: typeof Bell;
  onClick: () => void;
}) {
  const [, timeLabel] = item.date.split(" ");
  const relativeLabel = timeLabel;

  return (
    <button
      onClick={onClick}
      className="w-full text-start py-3 rounded-2xl transition-all bg-white hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-100 text-gray-main flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <Typography variant="caption" className="text-gray font-normal">
            {relativeLabel}
          </Typography>
          <div className="flex items-center gap-2 min-w-0">
            <Typography
              variant="body"
              className="text-gray-main font-normal truncate"
            >
              {item.title}
            </Typography>
            {!item.read && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          <Typography
            variant="small"
            className="text-gray font-normal break-words"
          >
            {item.description}
          </Typography>
        </div>

        <div className="shrink-0 flex items-center justify-center pt-1">
          <span className="text-gray text-2xl leading-none">›</span>
        </div>
      </div>
    </button>
  );
}
