import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppLayout } from "../../components/layout/AppLayout.tsx";
import { ROUTES } from "../../constants/routes.constant.ts";

export const Route = createFileRoute("/(main)")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isVouchersPage = currentPath === ROUTES.HOME;

  const headerProps = {
    isVouchersPage,
    description: isVouchersPage ? "השוברים שלי" : undefined,
    phoneNumber: "050-1234567",
  };

  return (
    <AppLayout headerProps={headerProps}>
      <Outlet />
    </AppLayout>
  );
}
