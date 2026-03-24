import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { cn } from "../utils/cn.utils.ts";
import { useAuthStore } from "../store/authStore.ts";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage() {
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const navigate = useNavigate();
  const digitsOnly = phone.replace(/\D/g, "");
  const isPhoneValid = digitsOnly.length === 10;

  return (
    <div className="flex flex-col gap-6">
      <Surface withBorder className="p-6 bg-white/90 backdrop-blur shadow-lg">
        <Typography variant="h1" className="text-gray-main">
          {t("auth.login.title")}
        </Typography>
        <Typography variant="body" className="text-gray mt-1">
          {t("auth.login.description")}
        </Typography>

        <label className="mt-6 flex flex-col gap-2">
          <Typography variant="small" className="text-gray-main font-medium">
            {t("auth.login.phoneLabel")}
          </Typography>
          <input
            type="tel"
            inputMode="tel"
            placeholder={t("auth.login.phonePlaceholder")}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={cn(
              "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-gray-main",
              "outline-none transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
            )}
            dir="ltr"
          />
        </label>

        <Button
          fullWidth
          className={cn("mt-6", !isPhoneValid && "opacity-60")}
          disabled={!isPhoneValid}
          onClick={() => {
            if (!isPhoneValid) return;
            setPhoneNumber(phone);
            navigate({ to: "/verification" });
          }}
        >
          {t("auth.login.cta")}
        </Button>
        {!isPhoneValid && phone.length > 0 && (
          <Typography variant="small" className="mt-2 text-critical font-medium">
            {t("auth.login.validation")}
          </Typography>
        )}
      </Surface>

      <div className="flex items-center justify-between text-sm text-gray">
        <span>{t("auth.login.helpText")}</span>
        <button className="font-semibold text-primary hover:underline">
          {t("auth.login.supportCta")}
        </button>
      </div>

      <Typography variant="caption" className="text-center text-gray">
        {t("auth.login.legal")}
      </Typography>
    </div>
  );
}
