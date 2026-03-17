export const REDEMPTIONS_HISTORY_FILTER = {
  ALL: "all",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type RedemptionsHistoryFilterKey =
  (typeof REDEMPTIONS_HISTORY_FILTER)[keyof typeof REDEMPTIONS_HISTORY_FILTER];

