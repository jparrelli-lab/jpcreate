import { formatCurrency, formatDate } from "@/lib/utils";
import type { DailyBalance } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DayDetailPanelProps {
  date: string | null;
  balance: DailyBalance | undefined;
}

export function DayDetailPanel({ date, balance }: DayDetailPanelProps) {
  if (!date) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          minHeight: "200px",
        }}
      >
        <span className="text-3xl mb-2">📅</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Select a day to see details
        </p>
      </div>
    );
  }

  const isPositive = (balance?.projectedBalance ?? 0) >= 0;
  const incomeEvents = balance?.events.filter((e) => e.type === "income") ?? [];
  const billEvents = balance?.events.filter((e) => e.type === "bill") ?? [];

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
        {formatDate(date).toUpperCase()}
      </p>

      {balance && (
        <div className="mb-5">
          <p
            className="text-3xl font-bold tabular-nums"
            style={{ color: isPositive ? "#10b981" : "#ef4444" }}
          >
            {formatCurrency(balance.projectedBalance)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            projected balance
          </p>
        </div>
      )}

      {balance?.events.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No scheduled events
        </p>
      )}

      {incomeEvents.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#10b981" }}>
            <TrendingUp size={12} /> INCOME
          </p>
          <div className="space-y-2">
            {incomeEvents.map((ev, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {ev.name}
                </span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: "#10b981" }}>
                  +{formatCurrency(ev.amountCents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {billEvents.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#ef4444" }}>
            <TrendingDown size={12} /> BILLS
          </p>
          <div className="space-y-2">
            {billEvents.map((ev, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {ev.name}
                </span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: "#ef4444" }}>
                  -{formatCurrency(ev.amountCents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
