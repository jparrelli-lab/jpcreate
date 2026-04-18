import { useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AddExpenseForm } from "./AddExpenseForm";
import { useTheme } from "@/theme/colors";
import type { Category, Expense } from "@/types";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  prefillCategoryId?: string;
  onAdd: (data: Omit<Expense, "id" | "createdAt">) => void;
}

export function AddExpenseSheet({ open, onClose, categories, prefillCategoryId, onAdd }: AddExpenseSheetProps) {
  const t = useTheme();
  const ref = useRef<BottomSheet>(null);

  useEffect(() => {
    if (open) ref.current?.expand();
    else ref.current?.close();
  }, [open]);

  const handleChange = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["70%", "90%"]}
      enablePanDownToClose
      onChange={handleChange}
      backgroundStyle={{ backgroundColor: t.bgCard }}
      handleIndicatorStyle={{ backgroundColor: t.border }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: t.textPrimary }]}>Add Expense</Text>
        <AddExpenseForm
          categories={categories}
          prefillCategoryId={prefillCategoryId}
          onSubmit={(data) => { onAdd(data); onClose(); }}
          onCancel={onClose}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
});
