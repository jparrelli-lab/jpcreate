"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TotalSpendingHeader } from "@/components/tracker/TotalSpendingHeader";
import { CategoryBudgetCard } from "@/components/tracker/CategoryBudgetCard";
import { SpendingDonut } from "@/components/tracker/SpendingDonut";
import { ExpenseList } from "@/components/tracker/ExpenseList";
import { AddExpenseDrawer } from "@/components/tracker/AddExpenseDrawer";
import { useAppStore } from "@/store/appStore";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { getCategories } from "@/lib/db";
import { useState } from "react";
import type { Category } from "@/types";
import { formatMonthYear } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TrackerPage() {
  const {
    selectedMonthYear,
    setSelectedMonthYear,
    isAddExpenseOpen,
    setAddExpenseOpen,
    prefillCategoryId,
    setPrefillCategoryId,
  } = useAppStore();

  const { expenses, addExpense, deleteExpense } = useExpenses(selectedMonthYear);
  const { budgets } = useBudgets(selectedMonthYear);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  function navigateMonth(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amountCents, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limitCents, 0);

  const categoriesWithSpend = categories.filter((cat) =>
    expenses.some((e) => e.categoryId === cat.id) ||
    budgets.some((b) => b.categoryId === cat.id)
  );
  const categoriesEmpty = categories.filter(
    (cat) =>
      !expenses.some((e) => e.categoryId === cat.id) &&
      !budgets.some((b) => b.categoryId === cat.id)
  );
  const displayCategories = [...categoriesWithSpend, ...categoriesEmpty];

  return (
    <PageWrapper>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Expenses
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

      <TotalSpendingHeader
        totalSpentCents={totalSpent}
        totalBudgetCents={totalBudget}
        monthYear={selectedMonthYear}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Categories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayCategories.map((cat) => {
                const spent = expenses
                  .filter((e) => e.categoryId === cat.id)
                  .reduce((s, e) => s + e.amountCents, 0);
                const budget = budgets.find((b) => b.categoryId === cat.id);
                return (
                  <CategoryBudgetCard
                    key={cat.id}
                    category={cat}
                    spentCents={spent}
                    budgetCents={budget?.limitCents ?? 0}
                    onAddExpense={() => {
                      setPrefillCategoryId(cat.id);
                      setAddExpenseOpen(true);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <SpendingDonut expenses={expenses} categories={categories} />
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onDelete={deleteExpense}
          />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          setPrefillCategoryId(undefined);
          setAddExpenseOpen(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-30"
        style={{ background: "#6366f1" }}
        aria-label="Add expense"
      >
        <Plus size={24} />
      </button>

      <AddExpenseDrawer
        open={isAddExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        categories={categories}
        prefillCategoryId={prefillCategoryId}
        onAdd={(data) => addExpense(data)}
      />
    </PageWrapper>
  );
}
