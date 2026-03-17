import { useTranslation } from "react-i18next";
import { History, Phone, Home } from "lucide-react";
import { Typography } from "../ui/Typography.tsx";
import { Surface } from "../ui/Surface.tsx";
import { useNavigate } from "@tanstack/react-router";

export function BottomNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const additionalActions = [
    {
      icon: History,
      label: t("vouchers.redemptionHistory"),
      onClick: () => navigate({ to: "/history" }),
    },
    {
      icon: Home,
      label: t("vouchers.menu.myVouchers"),
      onClick: () => navigate({ to: "/" }),
    },
    {
      icon: Phone,
      label: t("vouchers.customerService"),
    },
  ];

  return (
    <Surface
      className="px-4 py-2 shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.1)] rounded-none"
      as="footer"
    >
      <div className="flex gap-3">
        {additionalActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex-1 flex flex-col items-center gap-2 px-2 rounded-2xl transition-all hover:bg-secondary active:scale-95"
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
