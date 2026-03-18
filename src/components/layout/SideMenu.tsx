import { useTranslation } from "react-i18next";
import {
  Wallet,
  History,
  Bell,
  BookOpen,
  LifeBuoy,
  Info,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Typography } from "../ui/Typography.tsx";
import multipass_logo from "../../assets/multipass_logo.png";
import { cn } from "../../utils/cn.utils.ts";
import { useNavigate } from "@tanstack/react-router";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

export function SideMenu({ isOpen, onClose, phoneNumber }: SideMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: "primary",
      items: [
        { icon: Wallet, label: t("vouchers.menu.myVouchers"), id: "vouchers" },
        {
          icon: History,
          label: t("vouchers.menu.redemptionHistory"),
          id: "history",
        },
        {
          icon: Bell,
          label: t("vouchers.menu.notifications"),
          id: "notifications",
        },
      ],
    },
    {
      title: "secondary",
      items: [
        { icon: BookOpen, label: t("vouchers.menu.howToRedeem"), id: "how-to" },
        { icon: LifeBuoy, label: t("vouchers.menu.support"), id: "support" },
        { icon: Info, label: t("vouchers.menu.about"), id: "about" },
      ],
    },
    {
      title: "system",
      items: [
        { icon: Settings, label: t("vouchers.menu.settings"), id: "settings" },
        {
          icon: LogOut,
          label: t("vouchers.menu.logout"),
          id: "logout",
          destructive: true,
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-500 transition-all duration-300",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-1000 transition-all duration-300 ease-in-out shadow-2xl flex flex-col",
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full opacity-0 invisible pointer-events-none",
        )}
      >
        <div className="p-6 border-b border-slate-100 flex flex-col gap-6 relative">
          <div className="flex items-center justify-between">
            <img
              src={multipass_logo}
              alt="Multipass"
              className="h-8 w-fit mt-2"
            />
            <button
              onClick={onClose}
              className="p-2 text-slightly-black hover:opacity-80 active:scale-90 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {phoneNumber && (
            <div className="flex items-center justify-between gap-1">
              <Typography
                variant="caption"
                size="medium"
                className="text-gray font-bold uppercase tracking-wider"
              >
                {t("vouchers.details.title")}
              </Typography>
              <Typography
                variant="h2"
                size="medium"
                className="font-black text-gray-main"
                dir="ltr"
              >
                {phoneNumber}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4">
          {menuSections.map((section, idx) => (
            <div key={section.title} className="flex flex-col gap-1">
              {idx > 0 && <div className="h-px bg-slate-100 mb-2 mx-3" />}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all",
                    item.destructive
                      ? "text-red-500 hover:bg-red-50"
                      : "text-main-dark hover:bg-slate-50 hover:text-primary",
                  )}
                  onClick={() => {
                    onClose();
                    if (item.id === "vouchers") navigate({ to: "/" });
                    if (item.id === "history") navigate({ to: "/history" });
                    if (item.id === "notifications")
                      navigate({ to: "/notifications" });
                  }}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      item.destructive ? "text-red-500" : "text-primary",
                    )}
                  />
                  <Typography
                    size="medium"
                    variant="body"
                    className="font-bold"
                  >
                    {item.label}
                  </Typography>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
