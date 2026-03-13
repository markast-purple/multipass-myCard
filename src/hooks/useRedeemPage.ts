import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useBalances } from "./useBalances.ts";
import { useVoucherStore } from "../store/voucherStore.ts";

export function useRedeemPage() {
  const { voucherId } = useParams({
    from: "/(main)/vouchers/$voucherId/redeem",
  });
  const navigate = useNavigate();
  const { data: balancesData, refetch } = useBalances();
  const activeColorIndex = useVoucherStore((state) => state.activeColorIndex);

  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  const initialQtyRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const voucher = balancesData?.balances?.find((b: any) => b.id === voucherId);
  const numericCode = "8429 1035 7621";

  useEffect(() => {
    if (voucher && initialQtyRef.current === null) {
      initialQtyRef.current = voucher.currentBalance;
    }
  }, [voucher]);

  useEffect(() => {
    if (!isPolling) return;

    pollIntervalRef.current = window.setInterval(() => {
      refetch();
    }, 10000);

    timeoutRef.current = window.setTimeout(() => {
      setIsPolling(false);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }, 90000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPolling, refetch]);

  useEffect(() => {
    if (
      voucher &&
      initialQtyRef.current !== null &&
      voucher.currentBalance < initialQtyRef.current
    ) {
      setSuccess(true);
      setIsPolling(false);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [voucher]);

  const handleCopy = () => {
    navigator.clipboard.writeText(numericCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryAgain = () => setIsPolling(true);

  return {
    voucher,
    numericCode,
    success,
    copied,
    isPolling,
    handleCopy,
    handleTryAgain,
    navigate,
    activeColorIndex,
  };
}
