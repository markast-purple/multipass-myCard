import { createFileRoute } from "@tanstack/react-router";
import { RedeemPage } from "../../../../pages/RedeemPage.tsx";

export const Route = createFileRoute("/(main)/vouchers/$voucherId/redeem")({
  component: RedeemPage,
});
