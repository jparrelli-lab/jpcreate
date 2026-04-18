"use client";

import { BudgetCategoryRow } from "./BudgetCategoryRow";
import { CopyIcon } from "lucide-react";
import * as db from "@/lib/db";
import type { Category, Budget, Expense } from "@/types";

interface BudgetEditorProps {
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  allExpenses: Expense[];
  allBudgets: Budget[];
  monthYear: string;
  onUpdate: () => void;
}

function getHistory(
  categoryId: string,
  monthYear: string,
  allExpenses: Expense[],
  allBudgets: Budget[]
) {
  const [year, month] = monthYear.split("-").map(Number);
  return [-3, -2, -1].map((offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const spent = allExpenses
      .filter((e) => e.categoryId === categoryId && e.date.startsWith(m))
      .reduce((s, e) => s + e.amountCents, 0);
    const budget = allBudgets.find((b) => b.categoryId === categoryId && b.monthYear === m);
    return { month: m, spentCents: spent, limitCents: budget?.limitCents ?? 0 };
  });
}

function getPrevMonthYear(monthYear: string): string {
  const [year, month] = monthYear.split("-").map(Number);
  const d = new Date(year, month - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function BudgetEditor({
  categories,
  budgets,
  expenses,
  allExpenses,
  allBudgets,
  monthYear,
  onUpdate,
}: BudgetEditorProps) {
  function copyFromLastMonth() {
    const prev = getPrevMonthYear(monthYear);
    const prevBudgets = db.getBudgets(prev);
    for (const b of prevBudgets) {
      db.upsertBudget(b.categoryId, monthYear, b.limitCents);
    }
    onUpdate();
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          BUDGET LIMITS
        </p>
        <button
          onClick={copyFromLastMonth}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors hover:bg-black/5"
          style={{ color: "var(--text-muted)" }}
        >
          <CopyIcon size={12} />
          Copy from last month
        </button>
      </div>
      {categories.map((cat) => {
        const budget = budgets.find((b) => b.categoryId === cat.id);
        const spent = expenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((s, e) => s + e.amountCents, 0);
        const history = getHistory(cat.id, monthYear, allExpenses, allBudgets);
        return (
          <BudgetCategoryRow
            key={cat.id}
            category={cat}
            limitCents={budget?.limitCents ?? 0}
            spentCents={spent}
            history={history}
            onSave={(cents) => {
              db.upsertBudget(cat.id, monthYear, cents);
              onUpdate();
            }}
          />
        );
      })}
    </div>
  );
}
