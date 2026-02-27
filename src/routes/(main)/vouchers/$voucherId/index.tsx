import { createFileRoute } from "@tanstack/react-router";
import { VoucherDetailsPage } from "../../../../pages/VoucherDetailsPage.tsx";

export const Route = createFileRoute("/(main)/vouchers/$voucherId/")({
  component: VoucherDetailsPage,
});
