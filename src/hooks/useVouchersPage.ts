import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useBalances } from "./useBalances.ts";
import {
  VOUCHER_STATUS,
  type VoucherStatus,
} from "../components/VoucherCard.tsx";

export function useVouchersPage() {
  const { i18n } = useTranslation();
  const { data: balancesData, isLoading, isError, refetch } = useBalances();
  const [activeTab, setActiveTab] = useState<VoucherStatus>(
    VOUCHER_STATUS.ACTIVE,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.dir() === "rtl";

  const vouchers = useMemo(() => {
    if (!balancesData?.balances) return [];

    return balancesData.balances.filter((balance: any) => {
      if (activeTab === VOUCHER_STATUS.ACTIVE)
        return balance.currentBalance > 0;
      if (activeTab === VOUCHER_STATUS.REDEEMED)
        return (
          balance.currentBalance < balance.allocation &&
          balance.currentBalance >= 0
        );
      if (activeTab === VOUCHER_STATUS.EXPIRED)
        return balance.currentBalance === 0;
      return true;
    });
  }, [balancesData, activeTab]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || vouchers.length === 0) return;

    const scrollLeft = Math.abs(container.scrollLeft);
    const cardWidth = container.scrollWidth / vouchers.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, vouchers.length - 1));
  }, [vouchers.length]);

  const handleTabChange = (tab: VoucherStatus) => {
    setActiveTab(tab);
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
    }
  };

  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / vouchers.length;
    const scrollTo = cardWidth * index;
    container.scrollTo({
      left: isRtl ? -scrollTo : scrollTo,
      behavior: "smooth",
    });
  };

  return {
    vouchers,
    activeTab,
    activeIndex,
    isLoading,
    isError,
    refetch,
    scrollRef,
    isRtl,
    handleScroll,
    handleTabChange,
    scrollToCard,
  };
}
