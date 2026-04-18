import { View, Text, StyleSheet } from "react-native";
import { getDaysInMonth } from "date-fns";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import { BudgetProgressBar } from "./BudgetProgressBar";

interface TotalSpendingHeaderProps {
  totalSpentCents: number;
  totalBudgetCents: number;
  monthYear: string;
}

export function TotalSpendingHeader({ totalSpentCents, totalBudgetCents, monthYear }: TotalSpendingHeaderProps) {
  const t = useTheme();
  const percent = totalBudgetCents > 0 ? (totalSpentCents / totalBudgetCents) * 100 : 0;
  const [year, month] = monthYear.split("-").map(Number);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const daysLeft = isCurrentMonth ? getDaysInMonth(new Date(year, month - 1)) - today.getDate() : 0;
  const remaining = totalBudgetCents - totalSpentCents;

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <View style={styles.row}>
        <View>
          <Text style={[styles.label, { color: t.textMuted }]}>{formatMonthYear(monthYear)}</Text>
          <Text style={[styles.amount, { color: t.textPrimary }]}>{formatCurrency(totalSpentCents)}</Text>
        </View>
        <View style={styles.right}>
          {totalBudgetCents > 0 ? (
            <>
              <Text style={[styles.label, { color: t.textMuted }]}>of {formatCurrency(totalBudgetCents)} budget</Text>
              <Text style={[styles.remaining, { color: remaining >= 0 ? "#10b981" : "#ef4444" }]}>
                {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
              </Text>
            </>
          ) : (
            <Text style={[styles.label, { color: t.textMuted }]}>No budget set</Text>
          )}
        </View>
      </View>
      {totalBudgetCents > 0 && (
        <View style={styles.barArea}>
          <BudgetProgressBar percent={percent} height={8} />
          <View style={styles.barLabels}>
            <Text style={[styles.tiny, { color: t.textMuted }]}>{Math.round(percent)}% spent</Text>
            {isCurrentMonth && (
              <Text style={[styles.tiny, { color: t.textMuted }]}>{daysLeft} days left</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  right: { alignItems: "flex-end" },
  label: { fontSize: 13, marginBottom: 2 },
  amount: { fontSize: 32, fontWeight: "700", fontVariant: ["tabular-nums"] },
  remaining: { fontSize: 13, fontWeight: "600", fontVariant: ["tabular-nums"] },
  barArea: { marginTop: 16 },
  barLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  tiny: { fontSize: 11 },
});
