import { useTranslation } from "react-i18next";
import { Settings, ChevronRight } from "lucide-react";
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
}

export function Header({
  isVouchersPage,
  isMainPage,
  title,
  description,
  phoneNumber,
  onBack,
}: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        isMainPage
          ? "min-h-[120px] xs-short:min-h-[80px]"
          : "min-h-[84px] xs-short:min-h-[60px]",
        "bg-header w-full",
      )}
    >
      {isVouchersPage ? (
        <div className="flex flex-col bg-[#1a5c5c] h-[120px] xs-short:h-[80px]">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <img
              src={multipass_logo}
              className="h-8 xs-short:h-6 brightness-0 invert"
              alt="Multipass"
            />
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium" dir="ltr">
                {phoneNumber ? `הי, ${phoneNumber}` : ""}
              </span>
              <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Settings className="h-5 w-5 text-white" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-lg xs-short:text-base font-medium text-white text-center">
              {description}
            </span>
          </div>
        </div>
      ) : isMainPage ? (
        <div className="flex items-center relative justify-center h-[120px] xs-short:h-[80px]">
          {/* Simplified for now without Menu/Bell unless ported */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
            <div className="w-8 h-8" /> {/* Placeholder for Menu */}
            <div className="w-8 h-8" /> {/* Placeholder for Bell */}
          </div>
          {description && (
            <span className="text-lg xs-short:text-base font-medium text-white text-center whitespace-pre-line px-4">
              {description}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 h-full w-full text-white bg-header relative">
          <button
            onClick={onBack}
            className="p-1 absolute start-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 text-white transition-transform duration-200" />
          </button>
          <span className="text-lg xs-short:text-base font-medium text-white">
            {title || t("common.back")}
          </span>
        </div>
      )}
    </header>
  );
}
