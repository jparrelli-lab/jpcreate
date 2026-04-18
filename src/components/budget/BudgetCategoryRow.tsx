import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { formatCurrency, centsToDisplayValue, parseCentsFromInput } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import { BudgetProgressBar } from "@/components/tracker/BudgetProgressBar";
import { CategorySparkline } from "./CategorySparkline";
import type { Category } from "@/types";

interface BudgetCategoryRowProps {
  category: Category;
  limitCents: number;
  spentCents: number;
  history: { month: string; spentCents: number; limitCents: number }[];
  onSave: (cents: number) => void;
}

export function BudgetCategoryRow({ category, limitCents, spentCents, history, onSave }: BudgetCategoryRowProps) {
  const t = useTheme();
  const [value, setValue] = useState(limitCents > 0 ? centsToDisplayValue(limitCents) : "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(parseCentsFromInput(value));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const percent = limitCents > 0 ? (spentCents / limitCents) * 100 : 0;

  return (
    <View style={[styles.row, { borderBottomColor: t.border }]}>
      <Text style={styles.icon}>{category.icon}</Text>
      <View style={styles.middle}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: t.textPrimary }]}>{category.name}</Text>
          {spentCents > 0 && <Text style={[styles.spent, { color: t.textMuted }]}>{formatCurrency(spentCents)}</Text>}
        </View>
        {limitCents > 0 && <BudgetProgressBar percent={percent} height={3} />}
      </View>
      <CategorySparkline history={history} />
      <View style={[styles.inputWrap, { backgroundColor: t.inputBg, borderColor: t.border }]}>
        <Text style={[styles.curr, { color: t.textMuted }]}>$</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={t.textMuted}
          style={[styles.input, { color: t.textPrimary }]}
          returnKeyType="done"
        />
      </View>
      <View style={styles.checkWrap}>
        {saved && <Check color="#10b981" size={16} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 8 },
  icon: { fontSize: 20 },
  middle: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  name: { fontSize: 13, fontWeight: "600" },
  spent: { fontSize: 11, fontVariant: ["tabular-nums"] },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6 },
  curr: { fontSize: 12 },
  input: { width: 60, fontSize: 13, fontVariant: ["tabular-nums"], fontWeight: "500" },
  checkWrap: { width: 20, alignItems: "center" },
});
