import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { TotalSpendingHeader } from "@/components/tracker/TotalSpendingHeader";
import { CategoryBudgetCard } from "@/components/tracker/CategoryBudgetCard";
import { SpendingDonut } from "@/components/tracker/SpendingDonut";
import { ExpenseList } from "@/components/tracker/ExpenseList";
import { AddExpenseSheet } from "@/components/tracker/AddExpenseSheet";
import { useAppStore } from "@/store/appStore";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { getCategories } from "@/lib/db";
import { formatMonthYear } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { Category } from "@/types";

export default function TrackerScreen() {
  const t = useTheme();
  const { selectedMonthYear, setSelectedMonthYear, isAddExpenseOpen, setAddExpenseOpen, prefillCategoryId, setPrefillCategoryId } = useAppStore();
  const { expenses, addExpense, deleteExpense } = useExpenses(selectedMonthYear);
  const { budgets } = useBudgets(selectedMonthYear);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { setCategories(getCategories()); }, []);

  function navigate(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amountCents, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limitCents, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bgApp }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.topRow}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Expenses</Text>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={() => navigate(-1)} style={styles.navBtn}>
              <ChevronLeft color={t.textMuted} size={20} />
            </TouchableOpacity>
            <Text style={[styles.monthLabel, { color: t.textPrimary }]}>{formatMonthYear(selectedMonthYear)}</Text>
            <TouchableOpacity onPress={() => navigate(1)} style={styles.navBtn}>
              <ChevronRight color={t.textMuted} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <TotalSpendingHeader totalSpentCents={totalSpent} totalBudgetCents={totalBudget} monthYear={selectedMonthYear} />

        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>CATEGORIES</Text>
        {categories.map((cat) => {
          const spent = expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amountCents, 0);
          const budget = budgets.find((b) => b.categoryId === cat.id);
          return (
            <CategoryBudgetCard
              key={cat.id}
              category={cat}
              spentCents={spent}
              budgetCents={budget?.limitCents ?? 0}
              onPress={() => { setPrefillCategoryId(cat.id); setAddExpenseOpen(true); }}
            />
          );
        })}

        <SpendingDonut expenses={expenses} categories={categories} />
        <ExpenseList expenses={expenses} categories={categories} onDelete={deleteExpense} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => { setPrefillCategoryId(undefined); setAddExpenseOpen(true); }}
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      <AddExpenseSheet
        open={isAddExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        categories={categories}
        prefillCategoryId={prefillCategoryId}
        onAdd={(data) => addExpense(data)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 100 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: "700" },
  monthNav: { flexDirection: "row", alignItems: "center", gap: 4 },
  navBtn: { padding: 6 },
  monthLabel: { fontSize: 14, fontWeight: "500", minWidth: 100, textAlign: "center" },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  fab: { position: "absolute", bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: "#6366f1", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
});
