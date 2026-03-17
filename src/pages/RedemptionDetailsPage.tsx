import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { ComponentType } from "react";
import {
  Ban,
  CheckCircle2,
  Clock3,
  Download,
  ChevronLeft,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useVoucherHistory } from "../hooks/useVoucherHistory.ts";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { cn } from "../utils/cn.utils.ts";
import {
  mapRedemptionStatus,
  parseRedemptionDateTime,
  statusCircleClasses,
  statusIconKey,
} from "../utils/history.utils.ts";

const STATUS_ICONS: Record<
  ReturnType<typeof statusIconKey>,
  ComponentType<{ className?: string }>
> = {
  completed: CheckCircle2,
  pending: Clock3,
  failed: XCircle,
  cancelled: Ban,
  refunded: RotateCcw,
};

export function RedemptionDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { redemptionId } = useParams({ from: "/(main)/history/$redemptionId" });
  const { history } = useVoucherHistory();

  const item = history.find((h) => h.id === redemptionId);

  if (!item) {
    return (
      <Container className="px-4 py-6" noPadding>
        <Surface variant="muted" className="p-8 rounded-3xl text-center">
          <Typography variant="h2" className="font-medium">
            {t("vouchers.history.details.notFound")}
          </Typography>
          <button
            onClick={() => navigate({ to: "/history" })}
            className="mt-4 font-medium text-primary"
          >
            {t("common.back")}
          </button>
        </Surface>
      </Container>
    );
  }

  const uiStatus = mapRedemptionStatus(item.status);
  const circle = statusCircleClasses(uiStatus);
  const Icon = STATUS_ICONS[statusIconKey(uiStatus)];
  const dateTime = parseRedemptionDateTime(item.date);
  const dateLabel = dateTime
    ? new Intl.DateTimeFormat("he-IL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(dateTime)
    : item.date.split(" ")[0];
  const timeLabel = dateTime
    ? new Intl.DateTimeFormat("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateTime)
    : (item.date.split(" ")[1] ?? "");
  const statusGradient =
    uiStatus === "completed" || uiStatus === "refunded"
      ? "from-success/15 from-[0%] via-success/8 via-[50%] to-transparent to-[100%]"
      : uiStatus === "pending"
        ? "from-warning/15 from-[0%] via-warning/3 via-[50%] to-transparent to-[100%]"
        : uiStatus === "cancelled"
          ? "from-slate-200/80 from-[0%] via-slate-100/70 via-[50%] to-transparent to-[100%]"
          : "from-error/12 from-[0%] via-error/3 via-[50%] to-transparent to-[100%]";

  return (
    <div className={cn("flex-1 w-full", "bg-linear-to-b", statusGradient)}>
      <Container className="px-4 pt-4 pb-6 flex flex-col gap-4" noPadding>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/history" })}
            className="h-10 w-10 rounded-full bg-white/80 border border-white/60 shadow-md flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-primary rtl:-scale-x-100" />
          </button>
          <button className="h-10 w-10 rounded-full bg-white/80 border border-white/60 shadow-md flex items-center justify-center">
            <Download className="h-5 w-5 text-primary" />
          </button>
        </div>

        <div className="px-6 text-center flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-6">
            <div
              className={cn(
                "h-32 w-32 rounded-full flex items-center justify-center",
                circle.bg,
                circle.fg,
              )}
              aria-label={t(`vouchers.history.status.${uiStatus}`)}
              title={t(`vouchers.history.status.${uiStatus}`)}
            >
              <Icon className="h-20 w-20" />
            </div>
            <Typography
              variant="h1"
              className="font-medium text-4xl tabular-nums"
            >
              ₪{item.amount.toLocaleString()}
            </Typography>
            <div className="flex flex-col items-center gap-2">
              <Typography variant="h1" size="large" className="font-semibold">
                {item.provider}
              </Typography>
              <Typography variant="h1" size="medium" className="font-semibold">
                {item.name}
              </Typography>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Surface variant="muted" className="p-5 w-full bg-gray-200/70">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Typography
                    variant="body"
                    className="font-medium text-gray uppercase"
                  >
                    {t("vouchers.history.details.status")}
                  </Typography>
                  <Typography variant="body" className="font-bold text-right">
                    {t(`vouchers.history.status.${uiStatus}`)}
                  </Typography>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Typography
                    variant="body"
                    className="font-medium text-gray uppercase"
                  >
                    {t("vouchers.history.details.date")}
                  </Typography>
                  <Typography variant="body" className="font-bold text-right">
                    {dateLabel}
                  </Typography>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Typography
                    variant="body"
                    className="font-medium text-gray uppercase"
                  >
                    {t("vouchers.history.details.time")}
                  </Typography>
                  <Typography variant="body" className="font-bold text-right">
                    {timeLabel}
                  </Typography>
                </div>
              </div>
            </Surface>
            <Surface variant="muted" className="p-5 w-full bg-gray-200/70">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Typography
                    variant="body"
                    className="font-medium text-gray uppercase"
                  >
                    {t("vouchers.history.details.transactionId")}
                  </Typography>
                  <Typography variant="body" className="font-bold text-right">
                    {item.id}
                  </Typography>
                </div>

                {item.location && (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <Typography
                        variant="body"
                        className="font-medium uppercase text-gray"
                      >
                        {t("vouchers.history.details.location")}
                      </Typography>
                      <Typography
                        variant="body"
                        className="font-bold text-right"
                      >
                        {item.location}
                      </Typography>
                    </div>
                  </>
                )}
              </div>
            </Surface>
          </div>
        </div>
      </Container>
    </div>
  );
}
