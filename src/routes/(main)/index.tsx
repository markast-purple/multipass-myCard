import { createFileRoute } from "@tanstack/react-router";
import { VouchersPage } from "../../pages/VouchersPage.tsx";

export const Route = createFileRoute("/(main)/")({
  component: VouchersPage,
});
