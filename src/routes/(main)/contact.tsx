import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "../../pages/ContactPage.tsx";

export const Route = createFileRoute("/(main)/contact")({
  component: ContactPage,
});
