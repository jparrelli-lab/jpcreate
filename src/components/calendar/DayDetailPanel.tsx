import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { DailyBalance } from "@/types";

interface DayDetailPanelProps {
  date: string | null;
  balance: DailyBalance | undefined;
}

export function DayDetailPanel({ date, balance }: DayDetailPanelProps) {
  const t = useTheme();

  if (!date) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={[styles.emptyText, { color: t.textMuted }]}>Select a day to see details</Text>
      </View>
    );
  }

  const isPositive = (balance?.projectedBalance ?? 0) >= 0;
  const income = balance?.events.filter((e) => e.type === "income") ?? [];
  const bills = balance?.events.filter((e) => e.type === "bill") ?? [];

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.dateLabel, { color: t.textMuted }]}>{formatDate(date).toUpperCase()}</Text>
      {balance && (
        <View style={styles.balanceRow}>
          <Text style={[styles.balance, { color: isPositive ? "#10b981" : "#ef4444" }]}>
            {formatCurrency(balance.projectedBalance)}
          </Text>
          <Text style={[styles.balanceLabel, { color: t.textMuted }]}>projected balance</Text>
        </View>
      )}
      {balance?.events.length === 0 && (
        <Text style={[styles.noEvents, { color: t.textMuted }]}>No scheduled events</Text>
      )}
      {income.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#10b981" size={12} />
            <Text style={[styles.sectionLabel, { color: "#10b981" }]}>INCOME</Text>
          </View>
          {income.map((ev, i) => (
            <View key={i} style={styles.eventRow}>
              <Text style={[styles.eventName, { color: t.textPrimary }]}>{ev.name}</Text>
              <Text style={styles.incomeAmt}>+{formatCurrency(ev.amountCents)}</Text>
            </View>
          ))}
        </View>
      )}
      {bills.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingDown color="#ef4444" size={12} />
            <Text style={[styles.sectionLabel, { color: "#ef4444" }]}>BILLS</Text>
          </View>
          {bills.map((ev, i) => (
            <View key={i} style={styles.eventRow}>
              <Text style={[styles.eventName, { color: t.textPrimary }]}>{ev.name}</Text>
              <Text style={styles.billAmt}>-{formatCurrency(ev.amountCents)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  empty: { alignItems: "center", justifyContent: "center", minHeight: 120 },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 13 },
  dateLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  balanceRow: { marginBottom: 12 },
  balance: { fontSize: 28, fontWeight: "700", fontVariant: ["tabular-nums"] },
  balanceLabel: { fontSize: 11, marginTop: 2 },
  noEvents: { fontSize: 13 },
  section: { marginTop: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  sectionLabel: { fontSize: 11, fontWeight: "700" },
  eventRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  eventName: { fontSize: 13 },
  incomeAmt: { fontSize: 13, fontWeight: "600", color: "#10b981", fontVariant: ["tabular-nums"] },
  billAmt: { fontSize: 13, fontWeight: "600", color: "#ef4444", fontVariant: ["tabular-nums"] },
});
