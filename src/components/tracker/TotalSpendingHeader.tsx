import { formatCurrency, formatMonthYear } from "@/lib/utils";
import { BudgetProgressBar } from "./BudgetProgressBar";
import { getDaysInMonth } from "date-fns";

interface TotalSpendingHeaderProps {
  totalSpentCents: number;
  totalBudgetCents: number;
  monthYear: string;
}

export function TotalSpendingHeader({
  totalSpentCents,
  totalBudgetCents,
  monthYear,
}: TotalSpendingHeaderProps) {
  const percent = totalBudgetCents > 0 ? (totalSpentCents / totalBudgetCents) * 100 : 0;
  const [year, month] = monthYear.split("-").map(Number);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const daysLeft = isCurrentMonth ? getDaysInMonth(new Date(year, month - 1)) - today.getDate() : 0;
  const remaining = totalBudgetCents - totalSpentCents;

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div className="flex items-end justify-between mb-1">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {formatMonthYear(monthYear)}
          </p>
          <p className="text-4xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(totalSpentCents)}
          </p>
        </div>
        <div className="text-right">
          {totalBudgetCents > 0 && (
            <>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                of {formatCurrency(totalBudgetCents)} budget
              </p>
              <p
                className="text-sm font-semibold tabular-nums mt-0.5"
                style={{ color: remaining >= 0 ? "#10b981" : "#ef4444" }}
              >
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over`}
              </p>
            </>
          )}
          {totalBudgetCents === 0 && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No budget set
            </p>
          )}
        </div>
      </div>

      {totalBudgetCents > 0 && (
        <div className="mt-4">
          <BudgetProgressBar percent={percent} height="h-2.5" />
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {Math.round(percent)}% spent
            </span>
            {isCurrentMonth && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
