import type { RedemptionHistoryItem } from "../types/balance.dto.ts";
import type { RedemptionsHistoryFilterKey } from "../constants/redemptionsHistory.constant.ts";

export type RedemptionUiStatus =
  | "completed"
  | "pending"
  | "failed"
  | "cancelled"
  | "refunded";

export function mapRedemptionStatus(status: RedemptionHistoryItem["status"]) {
  switch (status) {
    case "success":
      return "completed" as const;
    case "pending":
      return "pending" as const;
    case "cancelled":
      return "cancelled" as const;
    case "refunded":
      return "refunded" as const;
    case "failed":
    default:
      return "failed" as const;
  }
}

export function parseRedemptionDateTime(input: string): Date | null {
  // Supports "DD/MM/YYYY HH:mm" (current mocks) and ISO-ish "YYYY-MM-DD HH:mm"
  const trimmed = input.trim();

  const ddmmyyyy = trimmed.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/,
  );
  if (ddmmyyyy) {
    const [, dd, mm, yyyy, hh = "00", min = "00"] = ddmmyyyy;
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      0,
      0,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const yyyymmdd = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/,
  );
  if (yyyymmdd) {
    const [, yyyy, mm, dd, hh = "00", min = "00"] = yyyymmdd;
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      0,
      0,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function redemptionTime(input: string) {
  const parts = input.trim().split(" ");
  return parts[1] ?? "";
}

function startOfDay(d: Date) {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type RedemptionGroupKey = "today" | "yesterday" | "date";

export function groupRedemptionsByDate(items: RedemptionHistoryItem[]) {
  const now = new Date();
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups = new Map<
    string,
    {
      key: RedemptionGroupKey;
      sortKey: number;
      dateLabel?: string;
      items: RedemptionHistoryItem[];
    }
  >();

    for (const item of items) {
      const dt = parseRedemptionDateTime(item.date);
      if (!dt) {
      const k = `date:${item.date.split(" ")[0] ?? item.date}`;
      const g = groups.get(k) ?? {
        key: "date" as const,
        sortKey: 0,
        dateLabel: item.date.split(" ")[0] ?? item.date,
        items: [],
      };
      g.items.push(item);
      groups.set(k, g);
      continue;
    }

    let groupKey: string;
    let meta:
      | { key: "today"; sortKey: number }
      | { key: "yesterday"; sortKey: number }
      | { key: "date"; sortKey: number; dateLabel: string };

    if (isSameDay(dt, today)) {
      groupKey = "today";
      meta = { key: "today", sortKey: today.getTime() };
    } else if (isSameDay(dt, yesterday)) {
      groupKey = "yesterday";
      meta = { key: "yesterday", sortKey: yesterday.getTime() };
    } else {
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const yy = String(dt.getFullYear()).slice(-2);
      const label = `${dd}/${mm}/${yy}`;
      groupKey = `date:${label}`;
      meta = { key: "date", sortKey: startOfDay(dt).getTime(), dateLabel: label };
    }

    const existing = groups.get(groupKey) ?? { ...meta, items: [] };
    existing.items.push(item);
    groups.set(groupKey, existing);
  }

  const result = [...groups.values()].sort((a, b) => b.sortKey - a.sortKey);
  for (const group of result) {
    group.items.sort((a, b) => {
      const da = parseRedemptionDateTime(a.date)?.getTime() ?? 0;
      const db = parseRedemptionDateTime(b.date)?.getTime() ?? 0;
      return db - da;
    });
  }

  return result;
}

export function filterToUiStatuses(
  filter: RedemptionsHistoryFilterKey,
): RedemptionUiStatus[] {
  switch (filter) {
    case "completed":
      return ["completed"];
    case "failed":
      return ["failed"];
    case "refunded":
      return ["refunded"];
    case "all":
    default:
      return ["completed", "pending", "failed", "cancelled", "refunded"];
  }
}

export function statusCircleClasses(status: RedemptionUiStatus) {
  switch (status) {
    case "completed":
      return { bg: "bg-success/10", fg: "text-success" } as const;
    case "pending":
      return { bg: "bg-warning/10", fg: "text-warning" } as const;
    case "refunded":
      return { bg: "bg-success/10", fg: "text-success" } as const;
    case "cancelled":
      return { bg: "bg-secondary", fg: "text-gray" } as const;
    case "failed":
    default:
      return { bg: "bg-error/10", fg: "text-error" } as const;
  }
}

export type RedemptionStatusIconKey =
  | "completed"
  | "pending"
  | "failed"
  | "cancelled"
  | "refunded";

export function statusIconKey(status: RedemptionUiStatus): RedemptionStatusIconKey {
  return status;
}
