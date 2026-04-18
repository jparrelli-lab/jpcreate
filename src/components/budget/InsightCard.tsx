import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { SpendingInsight } from "@/types";

interface InsightCardProps {
  insight: SpendingInsight;
}

const SEVERITY_CONFIG = {
  over: { border: "#ef4444", bg: "#fef2f2", icon: AlertTriangle, iconColor: "#ef4444", label: "Over budget" },
  warning: { border: "#f59e0b", bg: "#fffbeb", icon: AlertTriangle, iconColor: "#f59e0b", label: "Warning" },
  info: { border: "#6366f1", bg: "#eef2ff", icon: Info, iconColor: "#6366f1", label: "Info" },
};

export function InsightCard({ insight }: InsightCardProps) {
  const config = SEVERITY_CONFIG[insight.severity];
  const SeverityIcon = config.icon;

  const TrendIcon =
    insight.trend === "up" ? TrendingUp : insight.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    insight.trend === "up" ? "#ef4444" : insight.trend === "down" ? "#10b981" : "var(--text-muted)";

  return (
    <div
      className="rounded-xl p-4 flex gap-3"
      style={{
        background: config.bg,
        borderLeft: `4px solid ${config.border}`,
        border: `1px solid ${config.border}33`,
        borderLeftWidth: "4px",
        borderLeftColor: config.border,
      }}
    >
      <div className="shrink-0 mt-0.5">
        <span className="text-xl">{insight.category.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold" style={{ color: config.border }}>
            {insight.category.name}
          </p>
          {insight.trend && insight.trendPercent && (
            <span
              className="flex items-center gap-0.5 text-xs font-medium shrink-0"
              style={{ color: trendColor }}
            >
              <TrendIcon size={12} />
              {insight.trendPercent}%
            </span>
          )}
        </div>
        <p className="text-sm mt-0.5" style={{ color: "#374151" }}>
          {insight.message}
        </p>
        {insight.percentOfBudget > 0 && (
          <p className="text-xs mt-1.5" style={{ color: "#6b7280" }}>
            {Math.round(insight.percentOfBudget)}% of budget used
          </p>
        )}
      </div>
    </div>
  );
}
