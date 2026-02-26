import { BudgetTypeConstants, type BalanceItem } from "../types/balance.dto.ts";

export const MOCK_REDEEMED_VOUCHER: BalanceItem = {
  id: "mock_redeemed_1",
  name: "Buy 1 Get 1 Free - Pizza Hut",
  currentBalance: 50,
  allocation: 100,
  budgetType: BudgetTypeConstants.Personal,
  companies: ["Pizza Hut"],
  validUntil: "12/28",
  purchaseDate: "15/05/2026",
};

export const MOCK_EXPIRED_VOUCHER: BalanceItem = {
  id: "mock_expired_1",
  name: "Summer Vacation Discount",
  currentBalance: 0,
  allocation: 500,
  budgetType: BudgetTypeConstants.Personal,
  companies: ["Travel Agency"],
  validUntil: "08/25",
  purchaseDate: "10/06/2025",
};

export const MOCK_VOUCHERS: BalanceItem[] = [
  {
    id: "mock_active_1",
    name: "Golden Card Voucher",
    currentBalance: 250,
    allocation: 250,
    budgetType: BudgetTypeConstants.Uniform,
    companies: ["Supermarket A", "Supermarket B"],
    validUntil: "01/29",
    purchaseDate: "20/01/2026",
  },
  {
    id: "mock_active_2",
    name: "Weekend Movie Pass",
    currentBalance: 40,
    allocation: 40,
    budgetType: BudgetTypeConstants.Personal,
    companies: ["Cinema City"],
    validUntil: "06/27",
    purchaseDate: "05/02/2026",
  },
  {
    id: "mock_active_3",
    name: "Coffee Lover Rewards",
    currentBalance: 15,
    allocation: 15,
    budgetType: BudgetTypeConstants.Virtual,
    companies: ["Coffee Shop"],
    validUntil: "12/26",
    purchaseDate: "12/12/2025",
  },
  {
    id: "mock_active_4",
    name: "Gym Membership Discount",
    currentBalance: 100,
    allocation: 100,
    budgetType: BudgetTypeConstants.Personal,
    companies: ["Fit Center"],
    validUntil: "03/27",
    purchaseDate: "28/02/2026",
  },
  MOCK_REDEEMED_VOUCHER,
  MOCK_EXPIRED_VOUCHER,
];
