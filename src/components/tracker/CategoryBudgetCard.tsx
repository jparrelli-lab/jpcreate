import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { useTheme, CATEGORY_COLORS } from "@/theme/colors";
import { BudgetProgressBar } from "./BudgetProgressBar";
import type { Category } from "@/types";

interface CategoryBudgetCardProps {
  category: Category;
  spentCents: number;
  budgetCents: number;
  onPress: () => void;
}

export function CategoryBudgetCard({ category, spentCents, budgetCents, onPress }: CategoryBudgetCardProps) {
  const t = useTheme();
  const accent = CATEGORY_COLORS[category.color] ?? t.primary;
  const percent = budgetCents > 0 ? (spentCents / budgetCents) * 100 : 0;
  const isOver = budgetCents > 0 && spentCents > budgetCents;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border, borderLeftColor: accent }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={[styles.name, { color: t.textPrimary }]}>{category.name}</Text>
        </View>
        {isOver && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Over</Text>
          </View>
        )}
      </View>
      <View style={styles.amounts}>
        <Text style={[styles.spent, { color: t.textPrimary }]}>{formatCurrency(spentCents)}</Text>
        {budgetCents > 0 ? (
          <Text style={[styles.limit, { color: t.textMuted }]}>of {formatCurrency(budgetCents)}</Text>
        ) : (
          <Text style={[styles.limit, { color: t.textMuted }]}>no limit</Text>
        )}
      </View>
      {budgetCents > 0 && <BudgetProgressBar percent={percent} height={5} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 14, borderWidth: 1, borderLeftWidth: 3, marginBottom: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  icon: { fontSize: 18 },
  name: { fontSize: 14, fontWeight: "600" },
  badge: { backgroundColor: "#fee2e2", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#991b1b" },
  amounts: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 8 },
  spent: { fontSize: 18, fontWeight: "700", fontVariant: ["tabular-nums"] },
  limit: { fontSize: 12, fontVariant: ["tabular-nums"] },
});
