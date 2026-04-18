import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { formatCurrency } from "@/lib/utils";
import { useTheme, CATEGORY_COLORS } from "@/theme/colors";
import type { Category, Expense } from "@/types";

interface SpendingDonutProps {
  expenses: Expense[];
  categories: Category[];
}

export function SpendingDonut({ expenses, categories }: SpendingDonutProps) {
  const t = useTheme();

  const data = categories
    .map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: CATEGORY_COLORS[cat.color] ?? t.primary,
      value: expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amountCents, 0),
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>🍩</Text>
        <Text style={[styles.emptyText, { color: t.textMuted }]}>No expenses yet</Text>
      </View>
    );
  }

  const pieData = data.map((d) => ({ value: d.value, color: d.color }));

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.sectionLabel, { color: t.textMuted }]}>SPENDING BREAKDOWN</Text>
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          donut
          radius={75}
          innerRadius={50}
          innerCircleColor={t.bgCard}
          centerLabelComponent={() => (
            <View style={styles.center}>
              <Text style={[styles.centerAmount, { color: t.textPrimary }]}>{formatCurrency(total)}</Text>
              <Text style={[styles.centerLabel, { color: t.textMuted }]}>total</Text>
            </View>
          )}
        />
        <View style={styles.legend}>
          {data.slice(0, 5).map((d) => (
            <View key={d.name} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: d.color }]} />
              <Text style={[styles.legendName, { color: t.textMuted }]} numberOfLines={1}>
                {d.icon} {d.name}
              </Text>
              <Text style={[styles.legendAmount, { color: t.textPrimary }]}>{formatCurrency(d.value)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  empty: { alignItems: "center", justifyContent: "center", minHeight: 180 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 13 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  chartRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  center: { alignItems: "center" },
  centerAmount: { fontSize: 14, fontWeight: "700", fontVariant: ["tabular-nums"] },
  centerLabel: { fontSize: 10 },
  legend: { flex: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendName: { flex: 1, fontSize: 11 },
  legendAmount: { fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
