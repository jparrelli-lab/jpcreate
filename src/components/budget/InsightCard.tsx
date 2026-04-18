import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react-native";
import type { SpendingInsight } from "@/types";

const CONFIG = {
  over: { border: "#ef4444", bg: "#fff1f1", iconColor: "#ef4444" },
  warning: { border: "#f59e0b", bg: "#fffbeb", iconColor: "#f59e0b" },
  info: { border: "#6366f1", bg: "#eef2ff", iconColor: "#6366f1" },
};

interface InsightCardProps {
  insight: SpendingInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const c = CONFIG[insight.severity];
  const TrendIcon = insight.trend === "up" ? TrendingUp : insight.trend === "down" ? TrendingDown : null;
  const trendColor = insight.trend === "up" ? "#ef4444" : "#10b981";

  return (
    <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border + "44", borderLeftColor: c.border }]}>
      <Text style={styles.catIcon}>{insight.category.icon}</Text>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.border }]}>{insight.category.name}</Text>
          {TrendIcon && insight.trendPercent && (
            <View style={styles.trendBadge}>
              <TrendIcon color={trendColor} size={11} />
              <Text style={[styles.trendText, { color: trendColor }]}>{insight.trendPercent}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.message}>{insight.message}</Text>
        {insight.percentOfBudget > 0 && (
          <Text style={styles.pct}>{Math.round(insight.percentOfBudget)}% of budget used</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, borderLeftWidth: 4, marginBottom: 10 },
  catIcon: { fontSize: 22, marginTop: 2 },
  body: { flex: 1 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 13, fontWeight: "700" },
  trendBadge: { flexDirection: "row", alignItems: "center", gap: 2 },
  trendText: { fontSize: 11, fontWeight: "600" },
  message: { fontSize: 13, color: "#374151", lineHeight: 18 },
  pct: { fontSize: 11, color: "#6b7280", marginTop: 4 },
});
