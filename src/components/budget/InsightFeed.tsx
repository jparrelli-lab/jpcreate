import { InsightCard } from "./InsightCard";
import type { SpendingInsight } from "@/types";

interface InsightFeedProps {
  insights: SpendingInsight[];
}

export function InsightFeed({ insights }: InsightFeedProps) {
  if (insights.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          minHeight: "180px",
        }}
      >
        <span className="text-4xl mb-3">✅</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          No insights yet
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Add expenses and budgets to get recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        INSIGHTS & RECOMMENDATIONS
      </p>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
