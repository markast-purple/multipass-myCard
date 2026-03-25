import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn.utils.ts";
import { BottomSheet } from "./BottomSheet.tsx";
import { Button } from "./Button.tsx";
import { Typography } from "./Typography.tsx";
import "react-day-picker/style.css";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  minDate?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  zIndexBase?: number;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  label,
  placeholder,
  disabled,
  zIndexBase = 1400,
}: DatePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(
    value ? parse(value, "yyyy-MM-dd", new Date()) : undefined,
  );

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;
  const minDay = minDate ? parse(minDate, "yyyy-MM-dd", new Date()) : undefined;

  const handleOpen = () => {
    if (disabled) return;
    setTempDate(selectedDate);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (tempDate) {
      onChange(format(tempDate, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-2">
      {label && (
        <Typography variant="small" className="text-gray-main font-bold">
          {label}
        </Typography>
      )}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-full h-11 flex items-center justify-between px-3 text-base rounded-xl outline-none transition-all duration-200",
          "border border-border text-gray-main bg-white",
          "focus:border-primary focus:shadow-md",
          !value && "text-gray",
          disabled && "opacity-60 cursor-not-allowed bg-surface-muted",
        )}
        disabled={disabled}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gray" />
          <span>
            {value
              ? format(selectedDate!, "dd/MM/yyyy")
              : placeholder || t("vouchers.history.filters.datePlaceholder")}
          </span>
        </div>
        {value && !disabled && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray" />
          </div>
        )}
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("vouchers.history.filters.selectDate")}
        zIndexBase={zIndexBase}
        portal
      >
        <div className="min-h-[320px] w-full">
          <DayPicker
            mode="single"
            selected={tempDate}
            onSelect={setTempDate}
            disabled={minDay ? { before: minDay } : undefined}
            locale={he}
            dir="rtl"
            showOutsideDays
            className="px-3 bg-white w-full"
            classNames={{
              months: "w-full",
              month_grid: "w-full",
              today: "font-bold",
              weeks: "w-full",
              week: "w-full",
              day: "p-0",
              chevron: "fill-primary rotate-180",
              weekday: "text-center font-light text-gray",
              selected: "bg-primary text-white rounded-md",
              outside: "text-gray-soft",
              day_button:
                "w-full h-10 hover:bg-surface-muted rounded-md transition-colors",
            }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button fullWidth onClick={handleConfirm} disabled={!tempDate}>
            {t("vouchers.history.filters.approveDate")}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
