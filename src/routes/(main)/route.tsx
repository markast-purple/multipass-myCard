import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppLayout } from "../../components/layout/AppLayout.tsx";
import { ROUTES } from "../../constants/routes.constant.ts";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(main)")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const isVouchersPage = currentPath === ROUTES.HOME;
  const isHistoryListPage = currentPath === "/history";
  const isHistoryDetailsPage =
    currentPath.startsWith("/history/") && currentPath !== "/history";
  const isDetailsPage =
    currentPath.includes("/vouchers/") && !currentPath.endsWith("/redeem");
  const isRedeemPage = currentPath.endsWith("/redeem");

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
        : isHistoryListPage
          ? t("vouchers.redemptionHistory")
          : isHistoryDetailsPage
            ? t("vouchers.history.details.title")
        : undefined,
    description: isVouchersPage ? "השוברים שלי" : undefined,
    phoneNumber: "050-1234567",
    backTarget: isRedeemPage
      ? `/vouchers/${voucherId}`
      : isDetailsPage
        ? "/"
        : isHistoryDetailsPage
          ? "/history"
          : isHistoryListPage
            ? "/"
        : undefined,
  };

  return (
    <AppLayout headerProps={headerProps}>
      <Outlet />
    </AppLayout>
  );
}
