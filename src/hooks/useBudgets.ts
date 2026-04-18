"use client";

import { useState, useEffect, useCallback } from "react";
import * as db from "@/lib/db";
import type { Budget } from "@/types";

export function useBudgets(monthYear: string) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setBudgets(db.getBudgets(monthYear));
  }, [monthYear, refreshKey]);

  const upsertBudget = useCallback(
    (categoryId: string, limitCents: number) => {
      const updated = db.upsertBudget(categoryId, monthYear, limitCents);
      refresh();
      return updated;
    },
    [monthYear, refresh]
  );

  return { budgets, upsertBudget, refresh };
}
