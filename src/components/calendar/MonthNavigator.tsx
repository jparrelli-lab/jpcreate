import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { formatMonthYear } from "@/lib/utils";
import { useTheme } from "@/theme/colors";

interface MonthNavigatorProps {
  monthYear: string;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNavigator({ monthYear, onPrev, onNext }: MonthNavigatorProps) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPrev} style={styles.btn}>
        <ChevronLeft color={t.textMuted} size={20} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: t.textPrimary }]}>{formatMonthYear(monthYear)}</Text>
      <TouchableOpacity onPress={onNext} style={styles.btn}>
        <ChevronRight color={t.textMuted} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  btn: { padding: 8 },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700" },
});
