"use client";

import { useMemo } from "react";
import { generateInsights } from "@/lib/insights";
import type { Expense, Budget, Category, SpendingInsight } from "@/types";

export function useInsights(
  expenses: Expense[],
  budgets: Budget[],
  categories: Category[],
  targetMonth: string
): SpendingInsight[] {
  return useMemo(
    () => generateInsights(expenses, budgets, categories, targetMonth),
    [expenses, budgets, categories, targetMonth]
  );
}
