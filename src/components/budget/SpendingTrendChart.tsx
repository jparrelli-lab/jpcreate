import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTheme, CATEGORY_COLORS } from "@/theme/colors";
import type { Category, Expense } from "@/types";

interface SpendingTrendChartProps {
  categories: Category[];
  allExpenses: Expense[];
  monthYear: string;
}

function getMonths(monthYear: string): string[] {
  const [year, month] = monthYear.split("-").map(Number);
  return [-2, -1, 0].map((offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function shortMonth(my: string) {
  const [y, m] = my.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

export function SpendingTrendChart({ categories, allExpenses, monthYear }: SpendingTrendChartProps) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = width - 64;
  const months = getMonths(monthYear);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const active = categories.filter((cat) =>
    months.some((m) => allExpenses.some((e) => e.categoryId === cat.id && e.date.startsWith(m)))
  );

  if (active.length === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>📈</Text>
        <Text style={[styles.emptyText, { color: t.textMuted }]}>Track expenses to see trends</Text>
      </View>
    );
  }

  const visibleCats = active.filter((c) => !hidden.has(c.id));
  const lineData = visibleCats.map((cat) => ({
    color: CATEGORY_COLORS[cat.color] ?? t.primary,
    data: months.map((m) => ({
      value: allExpenses
        .filter((e) => e.categoryId === cat.id && e.date.startsWith(m))
        .reduce((s, e) => s + e.amountCents, 0) / 100,
      label: shortMonth(m),
    })),
  }));

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.label, { color: t.textMuted }]}>3-MONTH TREND</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toggleScroll}>
        <View style={styles.toggleRow}>
          {active.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setHidden((prev) => { const n = new Set(prev); n.has(cat.id) ? n.delete(cat.id) : n.add(cat.id); return n; })}
              style={[styles.toggle, { backgroundColor: hidden.has(cat.id) ? t.inputBg : `${CATEGORY_COLORS[cat.color]}22`, borderColor: hidden.has(cat.id) ? t.border : CATEGORY_COLORS[cat.color] }]}>
              <Text style={[styles.toggleText, { color: hidden.has(cat.id) ? t.textMuted : (CATEGORY_COLORS[cat.color] ?? t.primary) }]}>{cat.icon} {cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {lineData.length > 0 && (
        <LineChart
          dataSet={lineData}
          width={chartWidth}
          height={160}
          hideDataPoints={false}
          spacing={chartWidth / 3}
          yAxisTextStyle={{ color: t.textMuted, fontSize: 9 }}
          xAxisLabelTextStyle={{ color: t.textMuted, fontSize: 9 }}
          xAxisColor={t.border}
          yAxisColor={t.border}
          rulesColor={t.border}
          noOfSections={3}
          formatYLabel={(v) => `$${Math.round(Number(v))}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  empty: { alignItems: "center", justifyContent: "center", minHeight: 160 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 13 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  toggleScroll: { marginBottom: 12 },
  toggleRow: { flexDirection: "row", gap: 6 },
  toggle: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, borderWidth: 1 },
  toggleText: { fontSize: 11, fontWeight: "500" },
});
