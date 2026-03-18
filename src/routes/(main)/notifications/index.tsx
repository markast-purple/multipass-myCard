import { createFileRoute } from "@tanstack/react-router";
import { UpdatesNotificationsPage } from "../../../pages/UpdatesNotificationsPage.tsx";

export const Route = createFileRoute("/(main)/notifications/")({
  component: UpdatesNotificationsPage,
});
