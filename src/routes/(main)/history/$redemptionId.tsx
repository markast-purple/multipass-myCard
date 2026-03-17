import { createFileRoute } from "@tanstack/react-router";
import { RedemptionDetailsPage } from "../../../pages/RedemptionDetailsPage.tsx";

export const Route = createFileRoute("/(main)/history/$redemptionId")({
  component: RedemptionDetailsPage,
});

