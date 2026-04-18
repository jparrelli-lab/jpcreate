import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trash2 } from "lucide-react-native";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { Expense, Category } from "@/types";

interface ExpenseRowProps {
  expense: Expense;
  category: Category | undefined;
  onDelete: (id: string) => void;
}

export function ExpenseRow({ expense, category, onDelete }: ExpenseRowProps) {
  const t = useTheme();
  const time = new Date(expense.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const renderRightActions = () => (
    <TouchableOpacity
      style={[styles.deleteAction, { backgroundColor: "#ef4444" }]}
      onPress={() => onDelete(expense.id)}
    >
      <Trash2 color="white" size={18} />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={[styles.row, { backgroundColor: t.bgCard, borderBottomColor: t.border }]}>
        <Text style={styles.icon}>{category?.icon ?? "💸"}</Text>
        <View style={styles.middle}>
          <Text style={[styles.note, { color: t.textPrimary }]} numberOfLines={1}>
            {expense.note || category?.name || "Expense"}
          </Text>
          <Text style={[styles.meta, { color: t.textMuted }]}>
            {category?.name} · {time}
          </Text>
        </View>
        <Text style={[styles.amount, { color: t.textPrimary }]}>{formatCurrency(expense.amountCents)}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  icon: { fontSize: 22, marginRight: 12 },
  middle: { flex: 1 },
  note: { fontSize: 14, fontWeight: "500" },
  meta: { fontSize: 12, marginTop: 1 },
  amount: { fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"], marginLeft: 8 },
  deleteAction: { width: 64, justifyContent: "center", alignItems: "center" },
});
