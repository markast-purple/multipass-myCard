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
import { useState } from "react";
import { Typography } from "../ui/Typography.tsx";
import multipass_logo from "../../assets/multipass_logo.png";
import { cn } from "../../utils/cn.utils.ts";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/Button.tsx";
import { Surface } from "../ui/Surface.tsx";
import { useAuthStore } from "../../store/authStore.ts";
import { ROUTES } from "../../constants/routes.constant.ts";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

export function SideMenu({ isOpen, onClose, phoneNumber }: SideMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
                      ? "text-critical hover:bg-critical/10"
                      : "text-main-dark hover:bg-slate-50 hover:text-primary",
                  )}
                  onClick={() => {
                    if (item.id === "logout") {
                      setIsLogoutOpen(true);
                      return;
                    }
                    onClose();
                    if (item.id === "vouchers") navigate({ to: ROUTES.HOME });
                    if (item.id === "history") navigate({ to: "/history" });
                    if (item.id === "notifications")
                      navigate({ to: ROUTES.NOTIFICATIONS });
                    if (item.id === "support") navigate({ to: "/contact" });
                    if (item.id === "settings")
                      navigate({ to: ROUTES.SETTINGS });
                  }}
                >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        item.destructive ? "text-critical" : "text-primary",
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

      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-1000 transition-all duration-200",
          isLogoutOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        onClick={() => setIsLogoutOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-x-0 top-1/2 -translate-y-1/2 z-[1100] px-6 transition-all duration-200",
          isLogoutOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
      >
        <Surface className="max-w-sm mx-auto p-6 shadow-2xl" withBorder>
          <Typography variant="h2" className="text-gray-main">
            {t("auth.logout.title")}
          </Typography>
          <Typography variant="body" className="text-gray mt-2">
            {t("auth.logout.description")}
          </Typography>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              fullWidth
              className="bg-critical text-white hover:brightness-95"
              onClick={() => {
                clearAuth();
                setIsLogoutOpen(false);
                onClose();
                navigate({ to: "/login" });
              }}
            >
              {t("auth.logout.confirm")}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setIsLogoutOpen(false)}
            >
              {t("auth.logout.cancel")}
            </Button>
          </div>
        </Surface>
      </div>
    </>
  );
}
