import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Trash2 } from "lucide-react-native";
import { MonthNavigator } from "@/components/calendar/MonthNavigator";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetailPanel } from "@/components/calendar/DayDetailPanel";
import { RunningBalanceChart } from "@/components/calendar/RunningBalanceChart";
import { AddRecurringSheet } from "@/components/calendar/AddRecurringSheet";
import { useAppStore } from "@/store/appStore";
import { useRecurring } from "@/hooks/useRecurring";
import { useCashFlow } from "@/hooks/useCashFlow";
import { getMeta, updateMeta } from "@/lib/db";
import { formatCurrency, parseCentsFromInput } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import { TextInput } from "react-native";

export default function CalendarScreen() {
  const t = useTheme();
  const { selectedMonthYear, setSelectedMonthYear, selectedCalendarDate, setSelectedCalendarDate } = useAppStore();
  const { items, addItem, deleteItem } = useRecurring();
  const [startingBalance, setStartingBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState("0.00");
  const [editingBalance, setEditingBalance] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const meta = getMeta();
    setStartingBalance(meta.startingBalanceCents);
    setBalanceInput((meta.startingBalanceCents / 100).toFixed(2));
  }, []);

  const dailyBalances = useCashFlow(selectedMonthYear, items, startingBalance);
  const selectedBalance = dailyBalances.find((d) => d.date === selectedCalendarDate);

  function navigate(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function saveBalance() {
    const cents = parseCentsFromInput(balanceInput);
    setStartingBalance(cents);
    updateMeta({ startingBalanceCents: cents });
    setEditingBalance(false);
  }

  const incomeItems = items.filter((i) => i.type === "income");
  const billItems = items.filter((i) => i.type === "bill");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bgApp }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.topRow}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Cash Flow</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddOpen(true)}>
            <Plus color="white" size={16} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Starting balance */}
        <View style={[styles.balanceCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <Text style={[styles.balanceCardLabel, { color: t.textMuted }]}>STARTING BALANCE</Text>
          {editingBalance ? (
            <View style={styles.balanceEditRow}>
              <Text style={[styles.currency, { color: t.textMuted }]}>$</Text>
              <TextInput value={balanceInput} onChangeText={setBalanceInput} keyboardType="decimal-pad"
                onSubmitEditing={saveBalance} style={[styles.balanceInput, { color: t.textPrimary }]} autoFocus />
              <TouchableOpacity onPress={saveBalance} style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingBalance(true)}>
              <Text style={[styles.balanceAmount, { color: t.textPrimary }]}>{formatCurrency(startingBalance)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <MonthNavigator monthYear={selectedMonthYear} onPrev={() => navigate(-1)} onNext={() => navigate(1)} />
        <CalendarGrid monthYear={selectedMonthYear} dailyBalances={dailyBalances} selectedDate={selectedCalendarDate} onSelectDate={setSelectedCalendarDate} />

        <View style={styles.gap} />
        <DayDetailPanel date={selectedCalendarDate} balance={selectedBalance} />
        <RunningBalanceChart dailyBalances={dailyBalances} selectedDate={selectedCalendarDate} />

        {/* Recurring items list */}
        {(incomeItems.length > 0 || billItems.length > 0) && (
          <View style={[styles.itemsCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
            {incomeItems.length > 0 && (
              <>
                <View style={[styles.sectionHead, { borderBottomColor: t.border }]}>
                  <Text style={[styles.sectionHeadText, { color: "#10b981" }]}>INCOME</Text>
                </View>
                {incomeItems.map((item) => (
                  <View key={item.id} style={[styles.itemRow, { borderBottomColor: t.border }]}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: t.textPrimary }]}>{item.name}</Text>
                      <Text style={[styles.itemMeta, { color: t.textMuted }]}>{item.frequency} · day {item.dayOfMonth}</Text>
                    </View>
                    <Text style={[styles.itemAmt, { color: "#10b981" }]}>+{formatCurrency(item.amountCents)}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                      <Trash2 color="#ef4444" size={14} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
            {billItems.length > 0 && (
              <>
                <View style={[styles.sectionHead, { borderBottomColor: t.border }]}>
                  <Text style={[styles.sectionHeadText, { color: "#ef4444" }]}>BILLS</Text>
                </View>
                {billItems.map((item) => (
                  <View key={item.id} style={[styles.itemRow, { borderBottomColor: t.border }]}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: t.textPrimary }]}>{item.name}</Text>
                      <Text style={[styles.itemMeta, { color: t.textMuted }]}>{item.frequency} · day {item.dayOfMonth}</Text>
                    </View>
                    <Text style={[styles.itemAmt, { color: "#ef4444" }]}>-{formatCurrency(item.amountCents)}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                      <Trash2 color="#ef4444" size={14} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>

      <AddRecurringSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={(data) => { addItem(data); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: "700" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#6366f1", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
  balanceCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 16 },
  balanceCardLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  balanceEditRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  currency: { fontSize: 18, fontWeight: "700" },
  balanceInput: { flex: 1, fontSize: 22, fontWeight: "700", fontVariant: ["tabular-nums"] },
  saveBadge: { backgroundColor: "#6366f1", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  saveBadgeText: { color: "white", fontSize: 12, fontWeight: "600" },
  balanceAmount: { fontSize: 22, fontWeight: "700", fontVariant: ["tabular-nums"] },
  gap: { height: 16 },
  itemsCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginTop: 16 },
  sectionHead: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  sectionHeadText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "500" },
  itemMeta: { fontSize: 11, marginTop: 1, textTransform: "capitalize" },
  itemAmt: { fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"], marginRight: 12 },
  deleteBtn: { padding: 4 },
});
