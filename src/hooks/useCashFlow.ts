"use client";

import { useMemo } from "react";
import { buildMonthlyBalances } from "@/lib/cashflow";
import type { RecurringItem, DailyBalance } from "@/types";

export function useCashFlow(
  monthYear: string,
  recurringItems: RecurringItem[],
  startingBalanceCents: number
): DailyBalance[] {
  return useMemo(
    () => buildMonthlyBalances(monthYear, recurringItems, startingBalanceCents),
    [monthYear, recurringItems, startingBalanceCents]
  );
}
