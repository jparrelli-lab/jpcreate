"use client";

import { useState, useEffect, useCallback } from "react";
import * as db from "@/lib/db";
import type { Expense } from "@/types";

export function useExpenses(monthYear: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setExpenses(db.getExpenses({ monthYear }));
  }, [monthYear, refreshKey]);

  const addExpense = useCallback(
    (input: Omit<Expense, "id" | "createdAt">) => {
      const created = db.addExpense(input);
      refresh();
      return created;
    },
    [refresh]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      db.deleteExpense(id);
      refresh();
    },
    [refresh]
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<Expense>) => {
      db.updateExpense(id, patch);
      refresh();
    },
    [refresh]
  );

  return { expenses, addExpense, deleteExpense, updateExpense, refresh };
}
