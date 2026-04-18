import type { Expense, Budget, Category, SpendingInsight } from "@/types";

function spentInMonth(expenses: Expense[], categoryId: string, monthYear: string): number {
  return expenses
    .filter((e) => e.categoryId === categoryId && e.date.startsWith(monthYear))
    .reduce((sum, e) => sum + e.amountCents, 0);
}

function threeMonthAverage(
  expenses: Expense[],
  categoryId: string,
  targetMonth: string
): number {
  const [year, month] = targetMonth.split("-").map(Number);
  const months: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(year, month - 1 - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  const totals = months.map((m) => spentInMonth(expenses, categoryId, m));
  const nonZero = totals.filter((t) => t > 0);
  if (nonZero.length === 0) return 0;
  return nonZero.reduce((a, b) => a + b, 0) / nonZero.length;
}

export function generateInsights(
  expenses: Expense[],
  budgets: Budget[],
  categories: Category[],
  targetMonth: string
): SpendingInsight[] {
  const insights: SpendingInsight[] = [];

  for (const category of categories) {
    const spentCents = spentInMonth(expenses, category.id, targetMonth);
    if (spentCents === 0) continue;

    const budget = budgets.find(
      (b) => b.categoryId === category.id && b.monthYear === targetMonth
    );

    // No budget set for category with spend
    if (!budget) {
      insights.push({
        id: `no-budget-${category.id}`,
        severity: "info",
        category,
        message: `No budget set for ${category.name} — you've spent $${(spentCents / 100).toFixed(0)} this month.`,
        percentOfBudget: 0,
      });
      continue;
    }

    const percent = (spentCents / budget.limitCents) * 100;
    const avg = threeMonthAverage(expenses, category.id, targetMonth);
    let trend: SpendingInsight["trend"] = undefined;
    let trendPercent: number | undefined = undefined;

    if (avg > 0) {
      const change = ((spentCents - avg) / avg) * 100;
      if (change > 15) {
        trend = "up";
        trendPercent = Math.round(change);
      } else if (change < -10) {
        trend = "down";
        trendPercent = Math.round(Math.abs(change));
      } else {
        trend = "stable";
      }
    }

    if (percent >= 100) {
      insights.push({
        id: `over-${category.id}`,
        severity: "over",
        category,
        message: `You've spent $${(spentCents / 100).toFixed(0)} on ${category.name} this month vs your $${(budget.limitCents / 100).toFixed(0)} budget.`,
        percentOfBudget: percent,
        trend,
        trendPercent,
      });
    } else if (percent >= 80) {
      insights.push({
        id: `warn-${category.id}`,
        severity: "warning",
        category,
        message: `You're at ${Math.round(percent)}% of your ${category.name} budget.`,
        percentOfBudget: percent,
        trend,
        trendPercent,
      });
    } else if (trend === "up" && trendPercent && trendPercent > 20) {
      insights.push({
        id: `trend-up-${category.id}`,
        severity: "warning",
        category,
        message: `Your ${category.name} spending is up ${trendPercent}% compared to your recent average.`,
        percentOfBudget: percent,
        trend,
        trendPercent,
      });
    } else if (trend === "down" && trendPercent && trendPercent > 10) {
      insights.push({
        id: `trend-down-${category.id}`,
        severity: "info",
        category,
        message: `Your ${category.name} spending is down ${trendPercent}% from your recent average. Nice work!`,
        percentOfBudget: percent,
        trend,
        trendPercent,
      });
    }
  }

  // Sort: over → warning → info
  const order = { over: 0, warning: 1, info: 2 };
  return insights.sort((a, b) => order[a.severity] - order[b.severity]);
}
