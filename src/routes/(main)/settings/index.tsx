import { createFileRoute } from "@tanstack/react-router";
import { SettingsNotificationsPage } from "../../../pages/SettingsNotificationsPage.tsx";

export const Route = createFileRoute("/(main)/settings/")({
  component: SettingsNotificationsPage,
});
