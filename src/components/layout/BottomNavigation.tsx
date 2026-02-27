import { useTranslation } from "react-i18next";
import { History, Store, Phone } from "lucide-react";

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
    <footer>
      <div className="px-4 pt-2 shadow-[0_-10px_15px_-3px_rgba(26,92,92,0.08)]">
        <div className="flex gap-3">
          {additionalActions.map((action, index) => (
            <button
              key={index}
              className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all"
            >
              <action.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <span className="text-xs font-medium text-primary text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
