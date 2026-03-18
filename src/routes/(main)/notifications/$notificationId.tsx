import { createFileRoute } from "@tanstack/react-router";
import { UpdatesNotificationDetailsPage } from "../../../pages/UpdatesNotificationDetailsPage.tsx";

export const Route = createFileRoute("/(main)/notifications/$notificationId")({
  component: UpdatesNotificationDetailsPage,
});
