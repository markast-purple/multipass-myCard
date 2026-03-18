import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { Button } from "../components/ui/Button.tsx";
import { MOCK_NOTIFICATIONS } from "../mocks/notifications.mock.ts";
import { MOCK_VOUCHERS } from "../mocks/vouchers.mock.ts";

export function UpdatesNotificationDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notificationId } = useParams({
    from: "/(main)/notifications/$notificationId",
  });

  const notification = useMemo(
    () => MOCK_NOTIFICATIONS.find((item) => item.id === notificationId),
    [notificationId],
  );

  if (!notification) {
    return (
      <Container className="px-4 py-6" noPadding>
        <Surface variant="muted" className="p-8 rounded-3xl text-center">
          <Typography variant="h2" className="font-medium">
            {t("vouchers.notifications.details.notFound")}
          </Typography>
          <button
            onClick={() => navigate({ to: "/notifications" })}
            className="mt-4 font-medium text-primary"
          >
            {t("common.back")}
          </button>
        </Surface>
      </Container>
    );
  }

  const voucher = notification.voucherId
    ? MOCK_VOUCHERS.find((item) => item.id === notification.voucherId)
    : undefined;

  const [dateLabel, timeLabel] = notification.date.split(" ");
  const badgeLabel =
    notification.category === "updates"
      ? t("vouchers.notifications.badges.update")
      : t("vouchers.notifications.badges.alert");

  return (
    <Container className="px-4 py-6 flex-1 flex" noPadding>
      <div className="flex flex-col flex-1 justify-center gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className={
                  notification.category === "alerts"
                    ? "h-12 w-12 rounded-2xl bg-error/10 text-error flex items-center justify-center"
                    : "h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
                }
              >
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <Typography variant="h1" size="large" className="font-black">
                  {notification.title}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={
                      notification.category === "alerts"
                        ? "px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error"
                        : "px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
                    }
                  >
                    {badgeLabel}
                  </span>
                  <Typography variant="caption" className="text-gray">
                    {dateLabel} · {timeLabel}
                  </Typography>
                </div>
              </div>
            </div>

            <Typography variant="body" className="text-gray">
              {notification.description}
            </Typography>
          </div>

          <Surface variant="muted" className="p-5 rounded-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <Typography
                  variant="body"
                  className="font-medium text-gray uppercase"
                >
                  {t("vouchers.notifications.details.category")}
                </Typography>
                <Typography variant="body" className="font-bold">
                  {badgeLabel}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Typography
                  variant="body"
                  className="font-medium text-gray uppercase"
                >
                  {t("vouchers.notifications.details.date")}
                </Typography>
                <Typography variant="body" className="font-bold">
                  {dateLabel}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Typography
                  variant="body"
                  className="font-medium text-gray uppercase"
                >
                  {t("vouchers.notifications.details.time")}
                </Typography>
                <Typography variant="body" className="font-bold">
                  {timeLabel}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Typography
                  variant="body"
                  className="font-medium text-gray uppercase"
                >
                  {t("vouchers.notifications.details.relatedVoucher")}
                </Typography>
                <Typography variant="body" className="font-bold">
                  {voucher?.name ??
                    t("vouchers.notifications.details.systemMessage")}
                </Typography>
              </div>
            </div>
          </Surface>
        </div>

        <div className="pt-6">
          {voucher ? (
            <Button
              variant="primary"
              fullWidth
              onClick={() =>
                navigate({
                  to: "/vouchers/$voucherId",
                  params: { voucherId: voucher.id },
                })
              }
            >
              {t("vouchers.notifications.viewVoucher")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate({ to: "/" })}
            >
              {t("vouchers.notifications.viewAllVouchers")}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
