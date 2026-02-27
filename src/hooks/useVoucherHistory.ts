import { useMemo } from "react";
import { MOCK_REDEMPTION_HISTORY } from "../mocks/vouchers.mock.ts";

export function useVoucherHistory() {
  const history = useMemo(() => {
    // In a real app, this would be a react-query hook fetching from an API
    return MOCK_REDEMPTION_HISTORY;
  }, []);

  return {
    history,
    isLoading: false,
    isError: false,
  };
}
