import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { formatCurrency } from "@/lib/utils";
import { useTheme, CATEGORY_COLORS } from "@/theme/colors";
import type { Category, Expense } from "@/types";

interface SpendingDonutProps {
  expenses: Expense[];
  categories: Category[];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlicePath(cx: number, cy: number, outerR: number, innerR: number, start: number, end: number) {
  if (end - start >= 360) end = 359.99;
  const s1 = polarToCartesian(cx, cy, outerR, end);
  const e1 = polarToCartesian(cx, cy, outerR, start);
  const s2 = polarToCartesian(cx, cy, innerR, start);
  const e2 = polarToCartesian(cx, cy, innerR, end);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 0 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

export function SpendingDonut({ expenses, categories }: SpendingDonutProps) {
  const t = useTheme();

  const data = categories
    .map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: CATEGORY_COLORS[cat.color] ?? t.primary,
      value: expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amountCents, 0),
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>🍩</Text>
        <Text style={[styles.emptyText, { color: t.textMuted }]}>No expenses yet</Text>
      </View>
    );
  }

  const size = 150;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 65;
  const innerR = 44;

  let currentAngle = 0;
  const slices = data.map((d) => {
    const sweep = (d.value / total) * 360;
    const path = donutSlicePath(cx, cy, outerR, innerR, currentAngle, currentAngle + sweep);
    currentAngle += sweep;
    return { ...d, path };
  });

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.sectionLabel, { color: t.textMuted }]}>SPENDING BREAKDOWN</Text>
      <View style={styles.chartRow}>
        <View style={styles.svgWrapper}>
          <Svg width={size} height={size}>
            {slices.map((s, i) => (
              <Path key={i} d={s.path} fill={s.color} />
            ))}
            <Circle cx={cx} cy={cy} r={innerR - 2} fill={t.bgCard} />
          </Svg>
          <View style={[styles.center, { width: (innerR - 2) * 2, height: (innerR - 2) * 2 }]}>
            <Text style={[styles.centerAmount, { color: t.textPrimary }]}>{formatCurrency(total)}</Text>
            <Text style={[styles.centerLabel, { color: t.textMuted }]}>total</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {data.slice(0, 5).map((d) => (
            <View key={d.name} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: d.color }]} />
              <Text style={[styles.legendName, { color: t.textMuted }]} numberOfLines={1}>
                {d.icon} {d.name}
              </Text>
              <Text style={[styles.legendAmount, { color: t.textPrimary }]}>{formatCurrency(d.value)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  empty: { alignItems: "center", justifyContent: "center", minHeight: 180 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 13 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  chartRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  svgWrapper: { justifyContent: "center", alignItems: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  centerAmount: { fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] },
  centerLabel: { fontSize: 10 },
  legend: { flex: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendName: { flex: 1, fontSize: 11 },
  legendAmount: { fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
