import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppLayout } from "../../components/layout/AppLayout.tsx";
import { ROUTES } from "../../constants/routes.constant.ts";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore.ts";

export const Route = createFileRoute("/(main)")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  const phoneNumber = useAuthStore((state) => state.phoneNumber);

  const isVouchersPage = currentPath === ROUTES.HOME;
  const isHistoryListPage = currentPath === "/history";
  const isHistoryDetailsPage =
    currentPath.startsWith("/history/") && currentPath !== "/history";
  const isDetailsPage = /^\/vouchers\/[^/]+\/?$/.test(currentPath);
  const isRedeemPage = currentPath.endsWith("/redeem");
  const isSharePage = currentPath.endsWith("/share");
  const isNotificationsPage = currentPath === ROUTES.NOTIFICATIONS;
  const isNotificationDetailsPage =
    currentPath.startsWith(`${ROUTES.NOTIFICATIONS}/`) &&
    currentPath !== ROUTES.NOTIFICATIONS;

  const voucherIdMatch = currentPath.match(/\/vouchers\/([^\/]+)/);
  const voucherId = voucherIdMatch ? voucherIdMatch[1] : undefined;

  const headerProps = {
    isVouchersPage,
    isMainPage: isHistoryListPage,
    hideHeader: isHistoryDetailsPage,
    title: isDetailsPage
      ? t("vouchers.details.title")
      : isRedeemPage
        ? t("vouchers.redeem.title")
        : isSharePage
          ? t("vouchers.share.screenTitle")
          : isHistoryListPage
            ? t("vouchers.redemptionHistory")
            : isHistoryDetailsPage
              ? t("vouchers.history.details.title")
          : undefined,
    description: isVouchersPage ? "השוברים שלי" : undefined,
    phoneNumber: phoneNumber || undefined,
    backTarget: isRedeemPage
      ? `/vouchers/${voucherId}`
      : isSharePage
        ? `/vouchers/${voucherId}`
        : isDetailsPage
          ? "/"
          : isHistoryDetailsPage
            ? "/history"
            : isNotificationDetailsPage
              ? "/notifications"
              : isHistoryListPage || isNotificationsPage
                ? "/"
            : undefined,
  };

  return (
    <AppLayout headerProps={headerProps}>
      <Outlet />
    </AppLayout>
  );
}
