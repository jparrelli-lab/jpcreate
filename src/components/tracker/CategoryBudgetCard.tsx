import { formatCurrency } from "@/lib/utils";
import { BudgetProgressBar } from "./BudgetProgressBar";
import { Plus } from "lucide-react";
import type { Category } from "@/types";

interface CategoryBudgetCardProps {
  category: Category;
  spentCents: number;
  budgetCents: number;
  onAddExpense: () => void;
}

const COLOR_MAP: Record<string, string> = {
  slate: "#64748b",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308",
  indigo: "#6366f1",
  teal: "#14b8a6",
  emerald: "#10b981",
};

export function CategoryBudgetCard({
  category,
  spentCents,
  budgetCents,
  onAddExpense,
}: CategoryBudgetCardProps) {
  const percent = budgetCents > 0 ? (spentCents / budgetCents) * 100 : 0;
  const isOver = budgetCents > 0 && spentCents > budgetCents;
  const accentColor = COLOR_MAP[category.color] ?? "#6366f1";

  return (
    <div
      className="rounded-xl p-4 cursor-pointer group transition-all hover:shadow-md"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderLeftWidth: "3px",
        borderLeftColor: accentColor,
      }}
      onClick={onAddExpense}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.icon}</span>
          <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
            {category.name}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddExpense(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-6 h-6 flex items-center justify-center"
          style={{ background: accentColor + "22", color: accentColor }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <span className="text-lg font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
          {formatCurrency(spentCents)}
        </span>
        {budgetCents > 0 ? (
          <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
            of {formatCurrency(budgetCents)}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            no limit
          </span>
        )}
      </div>

      {budgetCents > 0 && <BudgetProgressBar percent={percent} />}

      {isOver && (
        <div className="mt-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Over budget
          </span>
        </div>
      )}
    </div>
  );
}
