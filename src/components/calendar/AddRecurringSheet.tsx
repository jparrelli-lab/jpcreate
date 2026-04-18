import { useRef, useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/theme/colors";
import { getTodayString, parseCentsFromInput } from "@/lib/utils";
import type { RecurringItem, RecurringFrequency, RecurringType } from "@/types";

const FREQS: { value: RecurringFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

interface AddRecurringSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<RecurringItem, "id">) => void;
}

export function AddRecurringSheet({ open, onClose, onAdd }: AddRecurringSheetProps) {
  const t = useTheme();
  const ref = useRef<BottomSheet>(null);
  const [type, setType] = useState<RecurringType>("income");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [startDate, setStartDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (open) ref.current?.expand();
    else ref.current?.close();
  }, [open]);

  const handleChange = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  function reset() {
    setType("income"); setName(""); setAmount(""); setFrequency("monthly"); setDayOfMonth("1"); setStartDate(new Date());
  }

  function handleSubmit() {
    const amountCents = parseCentsFromInput(amount);
    if (!name.trim() || amountCents === 0) return;
    const sd = startDate;
    const startStr = `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, "0")}-${String(sd.getDate()).padStart(2, "0")}`;
    onAdd({ type, name: name.trim(), amountCents, frequency, dayOfMonth: parseInt(dayOfMonth) || 1, startDate: startStr });
    reset();
    onClose();
  }

  return (
    <BottomSheet ref={ref} index={-1} snapPoints={["80%", "95%"]} enablePanDownToClose onChange={handleChange}
      backgroundStyle={{ backgroundColor: t.bgCard }} handleIndicatorStyle={{ backgroundColor: t.border }}>
      <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: t.textPrimary }]}>Add Income / Bill</Text>

        {/* Type */}
        <Text style={[styles.label, { color: t.textMuted }]}>TYPE</Text>
        <View style={styles.typeRow}>
          {(["income", "bill"] as RecurringType[]).map((tp) => (
            <TouchableOpacity key={tp} onPress={() => setType(tp)}
              style={[styles.typeBtn, { backgroundColor: type === tp ? (tp === "income" ? "#d1fae5" : "#fee2e2") : t.inputBg, borderColor: t.border }]}>
              <Text style={[styles.typeBtnText, { color: type === tp ? (tp === "income" ? "#065f46" : "#991b1b") : t.textMuted }]}>
                {tp === "income" ? "💰 Income" : "📄 Bill"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Name */}
        <Text style={[styles.label, { color: t.textMuted }]}>NAME</Text>
        <TextInput value={name} onChangeText={setName}
          placeholder={type === "income" ? "Paycheck, Freelance…" : "Rent, Netflix…"}
          placeholderTextColor={t.textMuted}
          style={[styles.input, { backgroundColor: t.inputBg, borderColor: t.border, color: t.textPrimary }]} />

        {/* Amount */}
        <Text style={[styles.label, { color: t.textMuted }]}>AMOUNT</Text>
        <View style={[styles.amountRow, { backgroundColor: t.inputBg, borderColor: t.border }]}>
          <Text style={[styles.currency, { color: t.textMuted }]}>$</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad"
            placeholder="0.00" placeholderTextColor={t.textMuted}
            style={[styles.amountInput, { color: t.textPrimary }]} />
        </View>

        {/* Frequency */}
        <Text style={[styles.label, { color: t.textMuted }]}>FREQUENCY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.freqRow}>
            {FREQS.map((f) => (
              <TouchableOpacity key={f.value} onPress={() => setFrequency(f.value)}
                style={[styles.freqBtn, { backgroundColor: frequency === f.value ? "#6366f120" : t.inputBg, borderColor: frequency === f.value ? "#6366f1" : t.border, borderWidth: frequency === f.value ? 2 : 1 }]}>
                <Text style={[styles.freqText, { color: frequency === f.value ? "#6366f1" : t.textMuted }]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Day of month */}
        {frequency === "monthly" && (
          <>
            <Text style={[styles.label, { color: t.textMuted }]}>DAY OF MONTH</Text>
            <TextInput value={dayOfMonth} onChangeText={setDayOfMonth} keyboardType="number-pad"
              style={[styles.input, { backgroundColor: t.inputBg, borderColor: t.border, color: t.textPrimary }]} />
          </>
        )}

        {/* Start date */}
        <Text style={[styles.label, { color: t.textMuted }]}>START DATE</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}
          style={[styles.input, styles.dateBtn, { backgroundColor: t.inputBg, borderColor: t.border }]}>
          <Text style={{ color: t.textPrimary }}>
            {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker value={startDate} mode="date" display="spinner"
            onChange={(_, d) => { setShowPicker(false); if (d) setStartDate(d); }} />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { backgroundColor: t.inputBg, borderColor: t.border }]}>
            <Text style={[styles.cancelText, { color: t.textMuted }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
            <Text style={styles.saveText}>Add</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  typeBtnText: { fontSize: 14, fontWeight: "600" },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
  amountRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
  currency: { fontSize: 18, fontWeight: "700", marginRight: 4 },
  amountInput: { flex: 1, fontSize: 18, fontWeight: "600", fontVariant: ["tabular-nums"] },
  freqRow: { flexDirection: "row", gap: 8 },
  freqBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  freqText: { fontSize: 13, fontWeight: "500" },
  dateBtn: { justifyContent: "center" },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 14, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600" },
  saveBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center", backgroundColor: "#6366f1" },
  saveText: { fontSize: 14, fontWeight: "700", color: "white" },
});
