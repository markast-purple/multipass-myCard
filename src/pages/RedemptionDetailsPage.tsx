import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useVoucherHistory } from "../hooks/useVoucherHistory.ts";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { mapRedemptionStatus } from "../utils/history.utils.ts";

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
          <Typography variant="h2" className="font-black">
            {t("vouchers.history.details.notFound")}
          </Typography>
          <button
            onClick={() => navigate({ to: "/history" })}
            className="mt-4 font-black text-primary"
          >
            {t("common.back")}
          </button>
        </Surface>
      </Container>
    );
  }

  const uiStatus = mapRedemptionStatus(item.status);

  return (
    <Container className="px-4 py-4 pb-6 flex flex-col gap-4" noPadding>
      <Surface variant="paper" className="p-5 rounded-3xl border border-slate-100">
        <div className="flex flex-col gap-1">
          <Typography variant="caption" className="font-black uppercase">
            {t("vouchers.history.details.merchant")}
          </Typography>
          <Typography variant="h2" className="font-black">
            {item.provider}
          </Typography>
          <Typography variant="body" className="mt-1">
            {item.name}
          </Typography>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Surface variant="muted" className="p-4 rounded-2xl">
            <Typography variant="caption" className="font-black uppercase">
              {t("vouchers.history.details.amount")}
            </Typography>
            <Typography variant="h2" className="font-black tabular-nums mt-1">
              ₪{item.amount.toLocaleString()}
            </Typography>
          </Surface>

          <Surface variant="muted" className="p-4 rounded-2xl">
            <Typography variant="caption" className="font-black uppercase">
              {t("vouchers.history.details.status")}
            </Typography>
            <Typography variant="h2" className="font-black mt-1">
              {t(`vouchers.history.status.${uiStatus}`)}
            </Typography>
          </Surface>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="caption" className="font-black uppercase">
              {t("vouchers.history.details.dateTime")}
            </Typography>
            <Typography variant="body" className="font-bold">
              {item.date}
            </Typography>
          </div>

          {item.location && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray" />
                <Typography variant="caption" className="font-black uppercase">
                  {t("vouchers.history.details.location")}
                </Typography>
              </div>
              <Typography variant="body" className="font-bold">
                {item.location}
              </Typography>
            </div>
          )}
        </div>
      </Surface>
    </Container>
  );
}
