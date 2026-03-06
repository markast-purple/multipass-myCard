import { useTranslation } from "react-i18next";
import { History, Store, Phone } from "lucide-react";
import { Typography } from "../ui/Typography.tsx";
import { Surface } from "../ui/Surface.tsx";

export function BottomNavigation() {
  const { t } = useTranslation();

  const additionalActions = [
    {
      icon: History,
      label: t("vouchers.redemptionHistory"),
    },
    {
      icon: Store,
      label: t("vouchers.participatingStores"),
    },
    {
      icon: Phone,
      label: t("vouchers.customerService"),
    },
  ];

  return (
    <Surface
      className="px-4 pt-2 shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.1)] rounded-none"
      as="footer"
    >
      <div className="flex gap-3">
        {additionalActions.map((action, index) => (
          <button
            key={index}
            className="flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all hover:bg-secondary active:scale-95"
          >
            <action.icon className="h-5 w-5 text-primary" strokeWidth={2} />
            <Typography
              variant="caption"
              className="text-primary text-center font-bold"
            >
              {action.label}
            </Typography>
          </button>
        ))}
      </div>
    </Surface>
  );
}
