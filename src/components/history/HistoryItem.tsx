import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  Ban,
  CheckCircle2,
  Clock3,
  MapPin,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { RedemptionHistoryItem } from "../../types/balance.dto.ts";
import { cn } from "../../utils/cn.utils.ts";
import {
  mapRedemptionStatus,
  redemptionTime,
  statusCircleClasses,
  statusIconKey,
} from "../../utils/history.utils.ts";
import { Typography } from "../ui/Typography.tsx";

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

interface HistoryItemProps {
  item: RedemptionHistoryItem;
  onClick?: () => void;
}

export function HistoryItem({ item, onClick }: HistoryItemProps) {
  const { t } = useTranslation();

  const uiStatus = mapRedemptionStatus(item.status);
  const time = redemptionTime(item.date);
  const circle = statusCircleClasses(uiStatus);
  const Icon = STATUS_ICONS[statusIconKey(uiStatus)];

  return (
    <div>
      <button
        onClick={onClick}
        className="w-full text-start hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <div className="flex items-center justify-start gap-3">
          <div className="shrink-0 flex items-center gap-2">
            <div
              className={cn(
                "h-11 w-11 rounded-full flex items-center justify-center shrink-0",
                circle.bg,
                circle.fg,
              )}
              aria-label={t(`vouchers.history.status.${uiStatus}`)}
              title={t(`vouchers.history.status.${uiStatus}`)}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Typography
                  variant="body"
                  className="leading-tight truncate text-gray-main"
                >
                  {item.name}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.location && (
                <div className="flex items-center gap-1 text-gray-main">
                  <MapPin className="h-3.5 w-3.5" />
                  <Typography
                    variant="caption"
                    className="font-medium text-gray-main"
                  >
                    {item.location}
                  </Typography>
                </div>
              )}
              {time && (
                <Typography
                  variant="caption"
                  className="tabular-nums font-medium text-gray-main"
                >
                  {time}
                </Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <Typography
              variant="body"
              className="leading-none tabular-nums font-medium"
            >
              ₪{item.amount.toLocaleString()}
            </Typography>
          </div>
        </div>
      </button>
    </div>
  );
}
