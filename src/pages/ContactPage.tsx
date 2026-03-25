import { Phone, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "../components/ui/Container.tsx";
import { Surface } from "../components/ui/Surface.tsx";
import { Typography } from "../components/ui/Typography.tsx";
import { Button } from "../components/ui/Button.tsx";

export function ContactPage() {
  const { t } = useTranslation();

  return (
    <Container className="flex flex-col gap-6 px-4 py-6" noPadding>
      <Surface withBorder className="p-6">
        <Typography variant="h1" className="text-gray-main">
          {t("contact.title")}
        </Typography>
        <Typography variant="body" className="text-gray mt-2">
          {t("contact.subtitle")}
        </Typography>
      </Surface>

      <Surface withBorder className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <Typography variant="body" className="font-bold text-gray-main">
              {t("contact.phone.title")}
            </Typography>
            <Typography variant="small" className="text-gray" dir="ltr">
              1-800-555-312
            </Typography>
          </div>
        </div>
        <Button variant="primary" fullWidth>
          {t("contact.phone.cta")}
        </Button>
      </Surface>

      <Surface withBorder className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <Typography variant="body" className="font-bold text-gray-main">
              {t("contact.email.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              support@multipass.example
            </Typography>
          </div>
        </div>
        <Button variant="secondary" fullWidth>
          {t("contact.email.cta")}
        </Button>
      </Surface>

      <Surface withBorder className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <Typography variant="body" className="font-bold text-gray-main">
              {t("contact.chat.title")}
            </Typography>
            <Typography variant="small" className="text-gray">
              {t("contact.chat.subtitle")}
            </Typography>
          </div>
        </div>
        <Button variant="outline" fullWidth>
          {t("contact.chat.cta")}
        </Button>
      </Surface>
    </Container>
  );
}
