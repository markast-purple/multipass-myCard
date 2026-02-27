export const BudgetTypeConstants = {
  Uniform: "uniform",
  Personal: "personal",
  Virtual: "virtual",
  MixedUniform: "mixedUniform",
} as const;

export type BudgetType =
  (typeof BudgetTypeConstants)[keyof typeof BudgetTypeConstants];

export interface BalanceItem {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  currentBalance: number;
  allocation: number;
  budgetType: BudgetType;
  companies?: string[];
  validUntil?: string;
  purchaseDate?: string;
}

export interface CardDetails {
  cardId: string;
  name: string;
  linkToIcon: string;
  balances: BalanceItem[];
}

export interface PointItem {
  pointId: number;
  pointName: string;
  totalLoad: number;
  leftToUse: number;
  isVirtual: boolean;
  networks: string[] | null;
}

export interface CardInfoResponse {
  name: string;
  cardId: string;
  linkToIcon: string;
  points: PointItem[];
  resultCode: number;
  message: string;
  messageHeb: string;
  error: unknown;
  isSuccess: boolean;
}

export type GetBalancesResponse = CardInfoResponse;

export interface RedemptionHistoryItem {
  id: string;
  voucherId: string;
  name: string;
  provider: string;
  amount: number;
  date: string;
  status: "success" | "failed";
  location?: string;
}
