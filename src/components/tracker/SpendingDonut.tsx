"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { Category, Expense } from "@/types";

interface SpendingDonutProps {
  expenses: Expense[];
  categories: Category[];
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

export function SpendingDonut({ expenses, categories }: SpendingDonutProps) {
  const data = categories
    .map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: COLOR_MAP[cat.color] ?? "#6366f1",
      value: expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amountCents, 0),
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          minHeight: "260px",
        }}
      >
        <span className="text-4xl mb-3">🍩</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          No expenses yet
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-muted)" }}>
        SPENDING BREAKDOWN
      </p>
      <div className="relative" style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value ?? 0)), ""]}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(total)}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-1.5">
        {data.slice(0, 5).map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span style={{ color: "var(--text-muted)" }}>
                {d.icon} {d.name}
              </span>
            </div>
            <span className="font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
