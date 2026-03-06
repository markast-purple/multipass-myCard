import { Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import multipass_logo from "../../assets/multipass_logo.png";
import { Typography } from "../ui/Typography.tsx";
import { Container } from "../ui/Container.tsx";

interface HeaderProps {
  isVouchersPage?: boolean;
  isMainPage?: boolean;
  title?: string;
  description?: string;
  phoneNumber?: string;
  onBack?: () => void;
  onNotificationClick?: () => void;
  unreadCount?: number;
  backTarget?: string;
}

export function Header({
  isVouchersPage,
  isMainPage,
  description,
  phoneNumber,
  onBack,
  backTarget,
}: HeaderProps) {
  const navigate = useNavigate();

  const isHome = isVouchersPage || isMainPage;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate({ to: backTarget || "/" });
    }
  };

  return (
    <header className="bg-surface w-full">
      <Container noPadding>
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 h-20">
            {isHome ? (
              <img
                src={multipass_logo}
                className="h-8 xs-short:h-6"
                alt="Multipass"
              />
            ) : (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <ChevronLeft className="h-8 w-8 text-primary rtl:-scale-x-100" />
              </button>
            )}

            <div className="flex items-center gap-2">
              {phoneNumber && (
                <Typography variant="small" className="text-primary" dir="ltr">
                  {`הי, ${phoneNumber}`}
                </Typography>
              )}
              <button className="p-1.5 rounded-full bg-secondary hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          {description && (
            <div className="flex-1 flex items-center justify-center pb-2">
              <Typography
                variant="body"
                className="text-primary text-center font-medium"
              >
                {description}
              </Typography>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
