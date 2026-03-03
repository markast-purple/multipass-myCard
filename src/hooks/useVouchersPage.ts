import { useState, useMemo } from "react";
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

  const handleTabChange = (tab: VoucherStatus) => {
    setActiveTab(tab);
  };

  return {
    vouchers,
    activeTab,
    isLoading,
    isError,
    refetch,
    isRtl,
    handleTabChange,
  };
}
