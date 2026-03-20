import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useBalances } from "../hooks/useBalances.ts";
import { Typography } from "../components/ui/Typography.tsx";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Button } from "../components/ui/Button.tsx";
import { SegmentedTabs } from "../components/ui/SegmentedTabs.tsx";
import { cn } from "../utils/cn.utils.ts";

export function ShareVoucherPage() {
  const { t } = useTranslation();
  const { voucherId } = useParams({ from: "/(main)/vouchers/$voucherId/share" });
  const navigate = useNavigate();
  const { data: balancesData, isLoading } = useBalances();
  const [recipient, setRecipient] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [method, setMethod] = useState<"phone" | "link">("phone");

  const voucher = balancesData?.balances?.find((b: any) => b.id === voucherId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
        <Typography variant="h2" className="mb-2">
          {t("vouchers.details.notFound")}
        </Typography>
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-primary font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          {t("vouchers.details.backToList")}
        </button>
      </div>
    );
  }

  const remaining = voucher.currentBalance;
  const allocation = voucher.allocation;
  const statusLabel =
    remaining <= 0
      ? t("vouchers.card.fullyUsed")
      : remaining < allocation
        ? t("vouchers.card.partiallyUsed")
        : t("vouchers.share.status.active");
  const statusClass =
    remaining <= 0
      ? "bg-slate-100 text-slate-500"
      : remaining < allocation
        ? "bg-warning/15 text-warning"
        : "bg-success/10 text-success";

  const canShare = method === "link" || Boolean(recipient.trim());

  return (
    <div className="px-4 flex-1 pb-6">
      <Container
        className="flex flex-1 flex-col rounded-3xl gap-5 pb-6 border-slate-100 border bg-slate-50 px-3"
        noPadding
      >
        <div className="pt-4">
          <Typography variant="h1" className="text-2xl font-black">
            {t("vouchers.share.screenTitle")}
          </Typography>
          <Typography variant="body" className="text-gray mt-1">
            {t("vouchers.share.screenSubtitle")}
          </Typography>
        </div>

        <Surface className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <Typography variant="caption" className="text-gray font-bold">
                {t("vouchers.share.amountLabel")}
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography
                  variant="h1"
                  className="text-3xl font-black text-gray-main tabular-nums"
                >
                  {remaining.toLocaleString()}
                </Typography>
                <Typography variant="body" className="text-sm font-bold text-gray">
                  ₪
                </Typography>
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold",
                statusClass,
              )}
            >
              {statusLabel}
            </span>
          </div>
        </Surface>

        <div className="flex flex-col gap-2">
          <Typography variant="caption" className="text-gray font-bold uppercase">
            {t("vouchers.share.methodLabel")}
          </Typography>
          <SegmentedTabs
            tabs={[
              { key: "phone", label: t("vouchers.share.methods.phone") },
              { key: "link", label: t("vouchers.share.methods.link") },
            ]}
            value={method}
            onChange={setMethod}
          />
        </div>

        <Surface className="p-4 rounded-2xl border border-slate-200 bg-white">
          {method === "phone" ? (
            <>
              <Typography
                variant="caption"
                className="text-gray font-bold uppercase"
              >
                {t("vouchers.share.phoneLabel")}
              </Typography>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={t("vouchers.share.phonePlaceholder")}
                inputMode="tel"
                type="tel"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </>
          ) : (
            <>
              <Typography variant="body" className="font-semibold">
                {t("vouchers.share.linkHintTitle")}
              </Typography>
              <Typography variant="body" className="text-gray mt-1">
                {t("vouchers.share.linkHintSubtitle")}
              </Typography>
            </>
          )}
        </Surface>

        <Button
          variant="primary"
          fullWidth
          disabled={!canShare}
          onClick={() => setConfirmOpen(true)}
        >
          {t("vouchers.share.shareNow")}
        </Button>

        <Typography variant="caption" className="text-gray">
          {t("vouchers.share.safetyShare")}
        </Typography>
      </Container>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
            aria-label={t("common.close")}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <Typography variant="h2" className="text-gray-main font-black">
              {t("vouchers.share.confirmSheetTitle")}
            </Typography>
            <Typography variant="body" className="text-gray mt-1">
              {t("vouchers.share.confirmSheetSubtitle")}
            </Typography>
            <div className="mt-4 flex flex-col gap-3">
              <Surface variant="muted" className="p-3 rounded-2xl">
                <div className="flex items-center justify-between">
                  <Typography variant="body" className="font-semibold text-gray">
                    {t("vouchers.share.amountLabel")}
                  </Typography>
                  <Typography variant="body" className="font-black">
                    ₪{remaining.toLocaleString()}
                  </Typography>
                </div>
              </Surface>
              <Surface variant="muted" className="p-3 rounded-2xl">
                {method === "phone" ? (
                  <div className="flex items-center justify-between">
                    <Typography variant="body" className="font-semibold text-gray">
                      {t("vouchers.share.phoneLabel")}
                    </Typography>
                    <Typography variant="body" className="font-black">
                      {recipient.trim()}
                    </Typography>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Typography variant="body" className="font-semibold text-gray">
                      {t("vouchers.share.methodLabel")}
                    </Typography>
                    <Typography variant="body" className="font-black">
                      {t("vouchers.share.methods.link")}
                    </Typography>
                  </div>
                )}
              </Surface>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <Button variant="primary" fullWidth>
                {t("vouchers.share.confirmShare")}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConfirmOpen(false)}
              >
                {t("vouchers.share.cancelShare")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
