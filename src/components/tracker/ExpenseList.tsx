"use client";

import { ExpenseRow } from "./ExpenseRow";
import type { Expense, Category } from "@/types";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

function groupByDate(expenses: Expense[]): Record<string, Expense[]> {
  const groups: Record<string, Expense[]> = {};
  for (const e of expenses) {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  }
  return groups;
}

function dateLabel(dateStr: string): string {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  if (dateStr === todayStr) return "Today";
  if (dateStr === yStr) return "Yesterday";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 flex flex-col items-center justify-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          minHeight: "200px",
        }}
      >
        <span className="text-4xl mb-3">📋</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          No expenses this month
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Tap + to add your first expense
        </p>
      </div>
    );
  }

  const sorted = [...expenses].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.createdAt.localeCompare(a.createdAt);
  });
  const groups = groupByDate(sorted);
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          RECENT EXPENSES
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
        {dates.map((date) => (
          <div key={date}>
            <div className="px-4 py-2" style={{ background: "var(--input-bg)" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                {dateLabel(date)}
              </span>
            </div>
            {groups[date].map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                category={categories.find((c) => c.id === expense.categoryId)}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
