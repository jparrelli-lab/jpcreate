import { SectionList, View, Text, StyleSheet } from "react-native";
import { ExpenseRow } from "./ExpenseRow";
import { useTheme } from "@/theme/colors";
import type { Expense, Category } from "@/types";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

function dateLabel(dateStr: string): string {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  if (dateStr === todayStr) return "Today";
  if (dateStr === yStr) return "Yesterday";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
  const t = useTheme();

  if (expenses.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>No expenses this month</Text>
        <Text style={[styles.emptyBody, { color: t.textMuted }]}>Tap + to add your first expense</Text>
      </View>
    );
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const groups: Record<string, Expense[]> = {};
  for (const e of sorted) {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  }
  const sections = Object.keys(groups).sort((a, b) => b.localeCompare(a)).map((date) => ({
    title: dateLabel(date),
    data: groups[date],
  }));

  return (
    <View style={[styles.container, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <View style={[styles.header, { borderBottomColor: t.border }]}>
        <Text style={[styles.headerLabel, { color: t.textMuted }]}>RECENT EXPENSES</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: t.inputBg }]}>
            <Text style={[styles.sectionTitle, { color: t.textMuted }]}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            category={categories.find((c) => c.id === item.categoryId)}
            onDelete={onDelete}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 16 },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  sectionHeader: { paddingHorizontal: 16, paddingVertical: 6 },
  sectionTitle: { fontSize: 11, fontWeight: "700" },
  empty: { borderRadius: 16, borderWidth: 1, padding: 40, alignItems: "center" },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  emptyBody: { fontSize: 13 },
});
