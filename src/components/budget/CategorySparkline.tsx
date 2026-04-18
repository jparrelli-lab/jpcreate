"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategorySparklineProps {
  history: { month: string; spentCents: number; limitCents: number }[];
}

export function CategorySparkline({ history }: CategorySparklineProps) {
  const data = history.map((h) => ({
    month: h.month,
    value: h.spentCents / 100,
    isOver: h.limitCents > 0 && h.spentCents > h.limitCents,
  }));

  return (
    <ResponsiveContainer width={80} height={32}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={18}>
        <Tooltip
          formatter={(v) => [formatCurrency(Number(v ?? 0) * 100), ""]}
          labelFormatter={(l) => String(l)}
          contentStyle={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px" }}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.isOver ? "#ef4444" : "#6366f1"} fillOpacity={0.7} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
