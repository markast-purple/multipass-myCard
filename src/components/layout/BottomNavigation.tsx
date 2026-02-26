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
    <footer className="z-50 fixed bottom-0 left-0 right-0 flex flex-col">
      <div className="px-4 pb-12 pt-2">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
          {t("vouchers.additionalActions")}
        </h3>
        <div className="flex gap-3">
          {additionalActions.map((action, index) => (
            <button
              key={index}
              className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-[#1a5c5c]/20 bg-white hover:bg-gray-50 active:scale-95 transition-all"
            >
              <action.icon
                className="h-5 w-5 text-[#1a5c5c]"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium text-[#1a5c5c] text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
