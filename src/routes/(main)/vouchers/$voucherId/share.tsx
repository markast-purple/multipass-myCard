import { createFileRoute } from "@tanstack/react-router";
import { ShareVoucherPage } from "../../../../pages/ShareVoucherPage.tsx";

export const Route = createFileRoute("/(main)/vouchers/$voucherId/share")({
  component: ShareVoucherPage,
});
