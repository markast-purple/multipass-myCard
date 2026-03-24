import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button.tsx";
import { OtpInput } from "../components/ui/OtpInput.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { cn } from "../utils/cn.utils.ts";
import { useAuthStore } from "../store/authStore.ts";
import { useNavigate } from "@tanstack/react-router";

export function OtpPage() {
  const [otp, setOtp] = useState("");
  const [error] = useState(false);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isComplete = useMemo(() => otp.length === 6, [otp]);

  return (
    <div className="flex flex-col gap-6">
      <Surface withBorder className="p-6 bg-white/90 backdrop-blur shadow-lg">
        <Typography variant="h1" className="text-gray-main">
          {t("auth.otp.title")}
        </Typography>
        <Typography variant="body" className="text-gray mt-1">
          {t("auth.otp.sentTo")}{" "}
          <span className="font-semibold text-gray-main" dir="ltr">
            {phoneNumber || t("auth.otp.phoneFallback")}
          </span>
        </Typography>

        <div className="mt-6">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            error={error}
            autoFocus
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray">
          <span>{t("auth.otp.resendPrompt")}</span>
          <button className="font-semibold text-primary hover:underline">
            {t("auth.otp.resendCta")}
          </button>
        </div>
      </Surface>

      <div className="flex flex-col gap-3">
        <Button
          fullWidth
          className={cn(!isComplete && "opacity-60")}
          disabled={!isComplete}
          onClick={() => {
            if (!isComplete) return;
            setAccessToken(`demo-token-${Date.now()}`);
            navigate({ to: "/" });
          }}
        >
          {t("auth.otp.verifyCta")}
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={() => {
            setPhoneNumber("");
            navigate({ to: "/login" });
          }}
        >
          {t("auth.otp.changePhoneCta")}
        </Button>
      </div>
    </div>
  );
}
