import { createFileRoute } from "@tanstack/react-router";
import { RedemptionsHistoryPage } from "../../../pages/RedemptionsHistoryPage.tsx";

export const Route = createFileRoute("/(main)/history/")({
  component: RedemptionsHistoryPage,
});

