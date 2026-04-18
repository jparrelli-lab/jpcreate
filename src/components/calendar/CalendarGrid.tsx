import { View, Text, FlatList, StyleSheet } from "react-native";
import { CalendarDay } from "./CalendarDay";
import { getDaysInMonth, getDay } from "date-fns";
import { useTheme } from "@/theme/colors";
import type { DailyBalance } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) { return String(n).padStart(2, "0"); }

interface CalendarGridProps {
  monthYear: string;
  dailyBalances: DailyBalance[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function CalendarGrid({ monthYear, dailyBalances, selectedDate, onSelectDate }: CalendarGridProps) {
  const t = useTheme();
  const [year, month] = monthYear.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const startOffset = getDay(firstDay);
  const daysInMonth = getDaysInMonth(firstDay);

  const prevDate = new Date(year, month - 2, 1);
  const pYear = prevDate.getFullYear(), pMonth = prevDate.getMonth() + 1;
  const daysInPrev = getDaysInMonth(new Date(year, month - 2, 1));
  const nextDate = new Date(year, month, 1);
  const nYear = nextDate.getFullYear(), nMonth = nextDate.getMonth() + 1;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const balanceMap = new Map(dailyBalances.map((d) => [d.date, d]));

  type Cell = { date: string; dayNum: number; isCurrent: boolean };
  const cells: Cell[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({ date: `${pYear}-${pad(pMonth)}-${pad(d)}`, dayNum: d, isCurrent: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: `${year}-${pad(month)}-${pad(d)}`, dayNum: d, isCurrent: true });
  }
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) {
    cells.push({ date: `${nYear}-${pad(nMonth)}-${pad(d)}`, dayNum: d, isCurrent: false });
  }

  return (
    <View style={[styles.container, { borderColor: t.border }]}>
      {/* Weekday headers */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((d) => (
          <View key={d} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: t.textMuted }]}>{d}</Text>
          </View>
        ))}
      </View>
      {/* Days grid */}
      <View style={styles.grid}>
        {cells.map((cell) => (
          <View key={cell.date} style={styles.cellWrapper}>
            <CalendarDay
              date={cell.date}
              dayNumber={cell.dayNum}
              isCurrentMonth={cell.isCurrent}
              isToday={cell.date === todayStr}
              isSelected={cell.date === selectedDate}
              balance={balanceMap.get(cell.date)}
              onPress={() => onSelectDate(cell.date)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  weekdays: { flexDirection: "row" },
  weekdayCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  weekdayText: { fontSize: 10, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cellWrapper: { width: "14.2857%" },
});
