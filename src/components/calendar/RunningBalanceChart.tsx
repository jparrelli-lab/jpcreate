"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { DailyBalance } from "@/types";

interface RunningBalanceChartProps {
  dailyBalances: DailyBalance[];
  selectedDate: string | null;
}

export function RunningBalanceChart({ dailyBalances, selectedDate }: RunningBalanceChartProps) {
  const data = dailyBalances.map((d) => ({
    day: parseInt(d.date.split("-")[2]),
    balance: d.projectedBalance / 100,
    date: d.date,
  }));

  const selected = data.find((d) => d.date === selectedDate);
  const today = new Date();
  const todayDay = today.getDate();

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
        RUNNING BALANCE
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
            width={36}
          />
          <Tooltip
            formatter={(val) => [formatCurrency(Number(val ?? 0) * 100), "Balance"]}
            labelFormatter={(day) => `Day ${day}`}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
          />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5} />
          <ReferenceLine
            x={todayDay}
            stroke="#6366f1"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "Today", fontSize: 9, fill: "#6366f1", position: "insideTopRight" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#balanceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
          {selected && (
            <ReferenceDot
              x={selected.day}
              y={selected.balance}
              r={5}
              fill="#6366f1"
              stroke="white"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
