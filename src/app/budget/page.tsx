"use client";

import { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BudgetEditor } from "@/components/budget/BudgetEditor";
import { SpendingTrendChart } from "@/components/budget/SpendingTrendChart";
import { InsightFeed } from "@/components/budget/InsightFeed";
import { useAppStore } from "@/store/appStore";
import { useInsights } from "@/hooks/useInsights";
import * as db from "@/lib/db";
import type { Category, Budget, Expense } from "@/types";
import { formatMonthYear } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BudgetPage() {
  const { selectedMonthYear, setSelectedMonthYear } = useAppStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);

  const loadData = useCallback(() => {
    setCategories(db.getCategories());
    setBudgets(db.getBudgets(selectedMonthYear));
    setExpenses(db.getExpenses({ monthYear: selectedMonthYear }));
    setAllExpenses(db.getExpenses());
    setAllBudgets(db.getAllBudgets());
  }, [selectedMonthYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const insights = useInsights(expenses, budgets, categories, selectedMonthYear);

  function navigateMonth(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Budgets
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium px-2" style={{ color: "var(--text-primary)" }}>
            {formatMonthYear(selectedMonthYear)}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Budget editor */}
        <div className="lg:col-span-3">
          <BudgetEditor
            categories={categories}
            budgets={budgets}
            expenses={expenses}
            allExpenses={allExpenses}
            allBudgets={allBudgets}
            monthYear={selectedMonthYear}
            onUpdate={loadData}
          />
        </div>

        {/* Right: Insights + Trend chart */}
        <div className="lg:col-span-2 space-y-6">
          <InsightFeed insights={insights} />
          <SpendingTrendChart
            categories={categories}
            allExpenses={allExpenses}
            monthYear={selectedMonthYear}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
