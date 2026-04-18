import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme/colors";
import type { DailyBalance } from "@/types";

interface RunningBalanceChartProps {
  dailyBalances: DailyBalance[];
  selectedDate: string | null;
}

export function RunningBalanceChart({ dailyBalances, selectedDate }: RunningBalanceChartProps) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = width - 64;

  const data = dailyBalances.map((d) => ({
    value: d.projectedBalance / 100,
    dataPointText: "",
    date: d.date,
    day: parseInt(d.date.split("-")[2]),
  }));

  const today = new Date().getDate();
  const selectedDay = selectedDate ? parseInt(selectedDate.split("-")[2]) : null;

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.label, { color: t.textMuted }]}>RUNNING BALANCE</Text>
      {data.length > 0 ? (
        <LineChart
          data={data}
          width={chartWidth}
          height={140}
          color="#6366f1"
          thickness={2}
          startFillColor="#6366f130"
          endFillColor="transparent"
          areaChart
          curved
          hideDataPoints
          yAxisTextStyle={{ color: t.textMuted, fontSize: 9 }}
          xAxisLabelTextStyle={{ color: t.textMuted, fontSize: 9 }}
          hideYAxisText={false}
          xAxisColor={t.border}
          yAxisColor={t.border}
          rulesColor={t.border}
          formatYLabel={(v) => `$${Math.round(Number(v) / 1000)}k`}
          hideRules={false}
          showVerticalLines={false}
          noOfSections={3}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: t.textMuted }]}>No data yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  empty: { height: 100, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 13 },
});
