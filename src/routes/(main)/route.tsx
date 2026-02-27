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
  const isDetailsPage =
    currentPath.includes("/vouchers/") && !currentPath.endsWith("/redeem");
  const isRedeemPage = currentPath.endsWith("/redeem");

  const voucherIdMatch = currentPath.match(/\/vouchers\/([^\/]+)/);
  const voucherId = voucherIdMatch ? voucherIdMatch[1] : undefined;

  const headerProps = {
    isVouchersPage,
    title: isDetailsPage
      ? t("vouchers.details.title")
      : isRedeemPage
        ? t("vouchers.redeem.title")
        : undefined,
    description: isVouchersPage ? "השוברים שלי" : undefined,
    phoneNumber: "050-1234567",
    backTarget: isRedeemPage
      ? `/vouchers/${voucherId}`
      : isDetailsPage
        ? "/"
        : undefined,
  };

  return (
    <AppLayout headerProps={headerProps}>
      <Outlet />
    </AppLayout>
  );
}
