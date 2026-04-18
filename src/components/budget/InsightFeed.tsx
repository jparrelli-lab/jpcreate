import { View, Text, StyleSheet } from "react-native";
import { InsightCard } from "./InsightCard";
import { useTheme } from "@/theme/colors";
import type { SpendingInsight } from "@/types";

interface InsightFeedProps {
  insights: SpendingInsight[];
}

export function InsightFeed({ insights }: InsightFeedProps) {
  const t = useTheme();

  if (insights.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>✅</Text>
        <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>No insights yet</Text>
        <Text style={[styles.emptyBody, { color: t.textMuted }]}>Add expenses and budgets to get recommendations</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.sectionLabel, { color: t.textMuted }]}>INSIGHTS & RECOMMENDATIONS</Text>
      {insights.map((i) => <InsightCard key={i.id} insight={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: "center" },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  emptyBody: { fontSize: 13, textAlign: "center" },
});
