import { Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import multipass_logo from "../../assets/multipass_logo.png";
import { cn } from "../../utils/cn.utils.ts";

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
    <header className={cn("bg-white w-full")}>
      <div className="flex flex-col bg-white">
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
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-8 w-8 text-primary rtl:rotate-180" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-primary text-sm font-medium" dir="ltr">
              {phoneNumber ? `הי, ${phoneNumber}` : ""}
            </span>
            <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Settings className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg xs-short:text-base font-medium text-primary text-center">
            {description}
          </span>
        </div>
      </div>
    </header>
  );
}
