import { useQuery } from "@tanstack/react-query";
import { BudgetTypeConstants, type CardDetails } from "../types/balance.dto.ts";
import { MOCK_VOUCHERS } from "../mocks/vouchers.mock.ts";

const fetchBalances = async (): Promise<CardDetails> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    cardId: "mock-card-id",
    name: "Multipass Card",
    linkToIcon: "",
    balances: MOCK_VOUCHERS,
  };
};

export const useBalances = () => {
  const query = useQuery({
    queryKey: ["balances"],
    queryFn: fetchBalances,
    retry: false,
  });

  const hasVirtualPoints =
    query.data?.balances.some(
      (b: any) => b.budgetType === BudgetTypeConstants.Virtual,
    ) ?? false;

  return {
    ...query,
    hasVirtualPoints,
  };
};
