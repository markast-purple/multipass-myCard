import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { Switch } from "../components/ui/Switch.tsx";

export function SettingsNotificationsPage() {
  const { t } = useTranslation();
  const [allEnabled, setAllEnabled] = useState(true);
  const [expiryEnabled, setExpiryEnabled] = useState(true);
  const [transactionsEnabled, setTransactionsEnabled] = useState(true);
  const [shareEnabled, setShareEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handleAllToggle = (value: boolean) => {
    setAllEnabled(value);
    setExpiryEnabled(value);
    setTransactionsEnabled(value);
    setShareEnabled(value);
    setMarketingEnabled(value);
  };

  useEffect(() => {
    const nextAll =
      expiryEnabled && transactionsEnabled && shareEnabled && marketingEnabled;
    if (allEnabled !== nextAll) {
      setAllEnabled(nextAll);
    }
  }, [
    allEnabled,
    expiryEnabled,
    transactionsEnabled,
    shareEnabled,
    marketingEnabled,
  ]);

  return (
    <Container className="flex flex-col gap-6 px-4 py-6" noPadding>
      <Surface withBorder className="p-6">
        <Typography variant="h1" className="text-gray-main">
          {t("settings.notifications.title")}
        </Typography>
        <Typography variant="body" className="text-gray mt-2">
          {t("settings.notifications.subtitle")}
        </Typography>
      </Surface>

      <Surface withBorder className="p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="body" className="font-bold text-gray-main">
              {t("settings.notifications.all.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("settings.notifications.all.subtitle")}
            </Typography>
          </div>
          <Switch checked={allEnabled} onChange={handleAllToggle} />
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="body" className="font-bold text-gray-main">
              {t("settings.notifications.expiry.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("settings.notifications.expiry.subtitle")}
            </Typography>
          </div>
          <Switch
            checked={expiryEnabled}
            onChange={setExpiryEnabled}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="body" className="font-bold text-gray-main">
              {t("settings.notifications.transactions.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("settings.notifications.transactions.subtitle")}
            </Typography>
          </div>
          <Switch
            checked={transactionsEnabled}
            onChange={setTransactionsEnabled}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="body" className="font-bold text-gray-main">
              {t("settings.notifications.share.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("settings.notifications.share.subtitle")}
            </Typography>
          </div>
          <Switch
            checked={shareEnabled}
            onChange={setShareEnabled}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="body" className="font-bold text-gray-main">
              {t("settings.notifications.marketing.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("settings.notifications.marketing.subtitle")}
            </Typography>
          </div>
          <Switch
            checked={marketingEnabled}
            onChange={setMarketingEnabled}
          />
        </div>
      </Surface>
    </Container>
  );
}
