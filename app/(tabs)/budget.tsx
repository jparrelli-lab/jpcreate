import { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react-native";
import { BudgetCategoryRow } from "@/components/budget/BudgetCategoryRow";
import { InsightFeed } from "@/components/budget/InsightFeed";
import { SpendingTrendChart } from "@/components/budget/SpendingTrendChart";
import { useAppStore } from "@/store/appStore";
import { useInsights } from "@/hooks/useInsights";
import * as db from "@/lib/db";
import { formatMonthYear } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { Category, Budget, Expense } from "@/types";

function getHistory(categoryId: string, monthYear: string, allExpenses: Expense[], allBudgets: Budget[]) {
  const [year, month] = monthYear.split("-").map(Number);
  return [-3, -2, -1].map((offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      month: m,
      spentCents: allExpenses.filter((e) => e.categoryId === categoryId && e.date.startsWith(m)).reduce((s, e) => s + e.amountCents, 0),
      limitCents: allBudgets.find((b) => b.categoryId === categoryId && b.monthYear === m)?.limitCents ?? 0,
    };
  });
}

export default function BudgetScreen() {
  const t = useTheme();
  const { selectedMonthYear, setSelectedMonthYear } = useAppStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);

  const load = useCallback(() => {
    setCategories(db.getCategories());
    setBudgets(db.getBudgets(selectedMonthYear));
    setExpenses(db.getExpenses({ monthYear: selectedMonthYear }));
    setAllExpenses(db.getExpenses());
    setAllBudgets(db.getAllBudgets());
  }, [selectedMonthYear]);

  useEffect(() => { load(); }, [load]);

  const insights = useInsights(expenses, budgets, categories, selectedMonthYear);

  function navigate(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function copyFromLastMonth() {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const prev = new Date(year, month - 2, 1);
    const prevMY = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
    for (const b of db.getBudgets(prevMY)) {
      db.upsertBudget(b.categoryId, selectedMonthYear, b.limitCents);
    }
    load();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bgApp }}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.topRow}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Budgets</Text>
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

        {/* Budget editor */}
        <View style={[styles.editorCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.editorHeader, { borderBottomColor: t.border }]}>
            <Text style={[styles.editorLabel, { color: t.textMuted }]}>BUDGET LIMITS</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={copyFromLastMonth}>
              <Copy color={t.textMuted} size={12} />
              <Text style={[styles.copyText, { color: t.textMuted }]}>Copy last month</Text>
            </TouchableOpacity>
          </View>
          {categories.map((cat) => {
            const budget = budgets.find((b) => b.categoryId === cat.id);
            const spent = expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amountCents, 0);
            return (
              <BudgetCategoryRow
                key={cat.id}
                category={cat}
                limitCents={budget?.limitCents ?? 0}
                spentCents={spent}
                history={getHistory(cat.id, selectedMonthYear, allExpenses, allBudgets)}
                onSave={(cents) => { db.upsertBudget(cat.id, selectedMonthYear, cents); load(); }}
              />
            );
          })}
        </View>

        <View style={styles.gap} />
        <InsightFeed insights={insights} />
        <View style={styles.gap} />
        <SpendingTrendChart categories={categories} allExpenses={allExpenses} monthYear={selectedMonthYear} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: "700" },
  monthNav: { flexDirection: "row", alignItems: "center", gap: 4 },
  navBtn: { padding: 6 },
  monthLabel: { fontSize: 13, fontWeight: "500", minWidth: 90, textAlign: "center" },
  editorCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  editorHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  editorLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: { fontSize: 11, fontWeight: "500" },
  gap: { height: 16 },
});
