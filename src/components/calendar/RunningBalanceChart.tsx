import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Path, Polyline, Line, Text as SvgText } from "react-native-svg";
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
  const chartW = width - 80;
  const chartH = 120;
  const padL = 40;
  const padB = 20;
  const innerW = chartW - padL;
  const innerH = chartH - padB;

  if (dailyBalances.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={[styles.label, { color: t.textMuted }]}>RUNNING BALANCE</Text>
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: t.textMuted }]}>No data yet</Text>
        </View>
      </View>
    );
  }

  const values = dailyBalances.map((d) => d.projectedBalance / 100);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const toX = (i: number) => padL + (i / (dailyBalances.length - 1)) * innerW;
  const toY = (v: number) => ((maxVal - v) / range) * innerH;

  const points = dailyBalances.map((d, i) => ({ x: toX(i), y: toY(d.projectedBalance / 100) }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${innerH} L ${points[0].x} ${innerH} Z`;

  const yMid = toY((maxVal + minVal) / 2);
  const fmtK = (v: number) =>
    Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${Math.round(v)}`;

  const selectedIdx = selectedDate
    ? dailyBalances.findIndex((d) => d.date === selectedDate)
    : -1;

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.label, { color: t.textMuted }]}>RUNNING BALANCE</Text>
      <Svg width={chartW} height={chartH}>
        {/* Area fill */}
        <Path d={areaPath} fill="#6366f118" />
        {/* Line */}
        <Path d={linePath} stroke="#6366f1" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* Y axis labels */}
        <SvgText x={padL - 4} y={4} textAnchor="end" fill={t.textMuted} fontSize={8}>{fmtK(maxVal)}</SvgText>
        <SvgText x={padL - 4} y={yMid + 4} textAnchor="end" fill={t.textMuted} fontSize={8}>{fmtK((maxVal + minVal) / 2)}</SvgText>
        <SvgText x={padL - 4} y={innerH} textAnchor="end" fill={t.textMuted} fontSize={8}>{fmtK(minVal)}</SvgText>
        {/* X axis labels - first, mid, last */}
        {[0, Math.floor((dailyBalances.length - 1) / 2), dailyBalances.length - 1].map((i) => (
          <SvgText key={i} x={toX(i)} y={chartH - 2} textAnchor="middle" fill={t.textMuted} fontSize={8}>
            {parseInt(dailyBalances[i].date.split("-")[2])}
          </SvgText>
        ))}
        {/* Selected date indicator */}
        {selectedIdx >= 0 && (
          <>
            <Line
              x1={points[selectedIdx].x}
              y1={0}
              x2={points[selectedIdx].x}
              y2={innerH}
              stroke="#6366f1"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <Svg x={points[selectedIdx].x - 3} y={points[selectedIdx].y - 3} width={6} height={6}>
              <Path d="M 3 0 A 3 3 0 1 1 2.99 0 Z" fill="#6366f1" />
            </Svg>
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  empty: { height: 100, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 13 },
});
