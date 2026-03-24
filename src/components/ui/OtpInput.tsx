import { cn } from "../../utils/cn.utils.ts";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  autoFocus?: boolean;
}

const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  ({ length, value, onChange, error, autoFocus }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const otp = useMemo(() => {
      const otpArray = value.split("").slice(0, length);
      while (otpArray.length < length) {
        otpArray.push("");
      }
      return otpArray;
    }, [value, length]);

    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    const handleChange = (index: number, newValue: string) => {
      const digit = newValue.replace(/\D/g, "");
      if (digit.length > 1) {
        handlePaste(digit, index);
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = digit;
      onChange(newOtp.join(""));

      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (e.key === "Backspace") {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (pastedData: string, startIndex: number) => {
      const digits = pastedData.replace(/\D/g, "").split("").slice(0, length);
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        const targetIndex = startIndex + i;
        if (targetIndex < length) {
          newOtp[targetIndex] = digit;
        }
      });

      onChange(newOtp.join(""));

      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      inputRefs.current[focusIndex]?.focus();
    };

    const handleFocus = (index: number) => {
      inputRefs.current[index]?.select();
    };

    return (
      <div className="flex gap-2 justify-center w-full" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
              if (index === 0 && ref) {
                if (typeof ref === "function") {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            aria-label={`Digit ${index + 1}`}
            className={cn(
              "w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl sm:text-3xl font-mono",
              "rounded-xl outline-none transition-all duration-200",
              "border-2 border-gray-200 text-gray-800 bg-white",
              "focus:border-primary focus:shadow-md focus:scale-105",
              error &&
                "border-critical focus:border-critical bg-critical/10",
            )}
            autoComplete={index === 0 ? "one-time-code" : "off"}
          />
        ))}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";

export { OtpInput };
