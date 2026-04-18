"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { Category, Expense } from "@/types";

interface SpendingTrendChartProps {
  categories: Category[];
  allExpenses: Expense[];
  monthYear: string;
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

function getMonths(monthYear: string): string[] {
  const [year, month] = monthYear.split("-").map(Number);
  return [-2, -1, 0].map((offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function shortMonth(monthYear: string): string {
  const [y, m] = monthYear.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

export function SpendingTrendChart({ categories, allExpenses, monthYear }: SpendingTrendChartProps) {
  const months = getMonths(monthYear);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  // Only show categories with any spend in the last 3 months
  const activeCategories = categories.filter((cat) =>
    months.some((m) =>
      allExpenses.some((e) => e.categoryId === cat.id && e.date.startsWith(m))
    )
  );

  const data = months.map((m) => {
    const row: Record<string, string | number> = { month: shortMonth(m) };
    for (const cat of activeCategories) {
      row[cat.id] = allExpenses
        .filter((e) => e.categoryId === cat.id && e.date.startsWith(m))
        .reduce((s, e) => s + e.amountCents, 0) / 100;
    }
    return row;
  });

  if (activeCategories.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          minHeight: "200px",
        }}
      >
        <span className="text-4xl mb-3">📈</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Track expenses to see trends
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <p className="text-xs font-semibold mb-4" style={{ color: "var(--text-muted)" }}>
        3-MONTH SPENDING TREND
      </p>

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setHidden((prev) => {
                const next = new Set(prev);
                if (next.has(cat.id)) next.delete(cat.id);
                else next.add(cat.id);
                return next;
              })
            }
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-opacity"
            style={{
              background: hidden.has(cat.id) ? "var(--input-bg)" : `${COLOR_MAP[cat.color]}22`,
              color: hidden.has(cat.id) ? "var(--text-muted)" : (COLOR_MAP[cat.color] ?? "#6366f1"),
              border: `1px solid ${hidden.has(cat.id) ? "var(--border-color)" : (COLOR_MAP[cat.color] ?? "#6366f1")}44`,
            }}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v ?? 0) * 100), ""]}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
          />
          {activeCategories
            .filter((cat) => !hidden.has(cat.id))
            .map((cat) => (
              <Line
                key={cat.id}
                type="monotone"
                dataKey={cat.id}
                name={`${cat.icon} ${cat.name}`}
                stroke={COLOR_MAP[cat.color] ?? "#6366f1"}
                strokeWidth={2}
                dot={{ r: 4, fill: COLOR_MAP[cat.color] ?? "#6366f1" }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
