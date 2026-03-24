import { createFileRoute } from "@tanstack/react-router";
import { OtpPage } from "../../pages/OtpPage.tsx";

export const Route = createFileRoute("/(auth)/verification")({
  component: OtpPage,
});
