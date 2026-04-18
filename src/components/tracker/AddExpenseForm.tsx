import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { getTodayString, parseCentsFromInput } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { Category } from "@/types";

interface AddExpenseFormProps {
  categories: Category[];
  prefillCategoryId?: string;
  onSubmit: (data: { amountCents: number; categoryId: string; note: string; date: string }) => void;
  onCancel: () => void;
}

export function AddExpenseForm({ categories, prefillCategoryId, onSubmit, onCancel }: AddExpenseFormProps) {
  const t = useTheme();
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(prefillCategoryId ?? "");
  const [note, setNote] = useState("");
  const [date] = useState(getTodayString());
  const amountRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => amountRef.current?.focus(), 200);
  }, []);

  const amountCents = parseCentsFromInput(amount);
  const isValid = amountCents > 0 && categoryId !== "";

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ amountCents, categoryId, note, date });
    setAmount("");
    setCategoryId(prefillCategoryId ?? "");
    setNote("");
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: t.textMuted }]}>AMOUNT</Text>
        <View style={[styles.amountRow, { backgroundColor: t.inputBg, borderColor: t.border }]}>
          <Text style={[styles.currency, { color: t.textMuted }]}>$</Text>
          <TextInput
            ref={amountRef}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={t.textMuted}
            style={[styles.amountInput, { color: t.textPrimary }]}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: t.textMuted }]}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.pills}>
            {categories.map((cat) => {
              const active = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={[styles.pill, { backgroundColor: active ? "#6366f120" : t.inputBg, borderColor: active ? "#6366f1" : t.border, borderWidth: active ? 2 : 1 }]}
                >
                  <Text style={styles.pillIcon}>{cat.icon}</Text>
                  <Text style={[styles.pillText, { color: active ? "#6366f1" : t.textMuted }]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: t.textMuted }]}>NOTE <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What was it for?"
          placeholderTextColor={t.textMuted}
          style={[styles.noteInput, { backgroundColor: t.inputBg, borderColor: t.border, color: t.textPrimary }]}
          returnKeyType="done"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onCancel} style={[styles.cancelBtn, { backgroundColor: t.inputBg, borderColor: t.border }]}>
          <Text style={[styles.cancelText, { color: t.textMuted }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} disabled={!isValid} style={[styles.saveBtn, { backgroundColor: isValid ? "#6366f1" : "#6366f150" }]}>
          <Text style={styles.saveText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  optional: { fontWeight: "400", textTransform: "none" },
  amountRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
  currency: { fontSize: 24, fontWeight: "700", marginRight: 4 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: "700", fontVariant: ["tabular-nums"] },
  pills: { flexDirection: "row", gap: 8 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  pillIcon: { fontSize: 16 },
  pillText: { fontSize: 13, fontWeight: "500" },
  noteInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 14, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600" },
  saveBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveText: { fontSize: 14, fontWeight: "700", color: "white" },
});
