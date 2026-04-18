import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EventPill } from "./EventPill";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { DailyBalance } from "@/types";

interface CalendarDayProps {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  balance: DailyBalance | undefined;
  onPress: () => void;
}

export function CalendarDay({ date, dayNumber, isCurrentMonth, isToday, isSelected, balance, onPress }: CalendarDayProps) {
  const t = useTheme();
  const maxPills = 2;
  const overflow = (balance?.events.length ?? 0) - maxPills;

  let bg = t.bgCard;
  if (isSelected) bg = "#eef2ff";
  else if (isToday) bg = "#fef9c3";

  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor: bg, borderColor: t.border, opacity: isCurrentMonth ? 1 : 0.4 }, isSelected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.dayNumRow}>
        <View style={[styles.dayNumWrap, isToday && styles.todayCircle]}>
          <Text style={[styles.dayNum, { color: isToday ? "white" : t.textPrimary }]}>{dayNumber}</Text>
        </View>
      </View>
      {balance?.events.slice(0, maxPills).map((ev, i) => <EventPill key={i} occurrence={ev} />)}
      {overflow > 0 && <Text style={[styles.more, { color: t.textMuted }]}>+{overflow}</Text>}
      {balance && isCurrentMonth && (
        <Text style={[styles.balance, { color: balance.projectedBalance >= 0 ? "#10b981" : "#ef4444" }]} numberOfLines={1}>
          {formatCurrency(balance.projectedBalance)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, minHeight: 80, borderWidth: StyleSheet.hairlineWidth, padding: 4 },
  selected: { borderWidth: 2, borderColor: "#6366f1" },
  dayNumRow: { alignItems: "flex-end", marginBottom: 2 },
  dayNumWrap: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  todayCircle: { backgroundColor: "#6366f1" },
  dayNum: { fontSize: 11, fontWeight: "600" },
  more: { fontSize: 9 },
  balance: { fontSize: 9, fontWeight: "600", fontVariant: ["tabular-nums"], marginTop: 2 },
});
