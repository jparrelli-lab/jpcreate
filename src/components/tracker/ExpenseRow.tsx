"use client";

import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Expense, Category } from "@/types";

interface ExpenseRowProps {
  expense: Expense;
  category: Category | undefined;
  onDelete: (id: string) => void;
}

export function ExpenseRow({ expense, category, onDelete }: ExpenseRowProps) {
  const time = new Date(expense.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 group rounded-lg transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
    >
      <span className="text-xl shrink-0">{category?.icon ?? "💸"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {expense.note || category?.name || "Expense"}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {category?.name} · {time}
        </p>
      </div>
      <span className="text-sm font-semibold tabular-nums shrink-0" style={{ color: "var(--text-primary)" }}>
        {formatCurrency(expense.amountCents)}
      </span>
      <button
        onClick={() => onDelete(expense.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        style={{ color: "#ef4444" }}
        aria-label="Delete expense"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
