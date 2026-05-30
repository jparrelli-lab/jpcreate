import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Path, Polyline, Line, Text as SvgText, Circle } from "react-native-svg";
import { useState } from "react";
import { useTheme, CATEGORY_COLORS } from "@/theme/colors";
import type { Category, Expense } from "@/types";

interface SpendingTrendChartProps {
  categories: Category[];
  allExpenses: Expense[];
  monthYear: string;
}

function getMonths(monthYear: string): string[] {
  const [year, month] = monthYear.split("-").map(Number);
  return [-2, -1, 0].map((offset) => {
    const d = new Date(year, month - 1 + offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function shortMonth(my: string) {
  const [y, m] = my.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

export function SpendingTrendChart({ categories, allExpenses, monthYear }: SpendingTrendChartProps) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const chartW = width - 64;
  const chartH = 140;
  const padL = 36;
  const padB = 20;
  const innerW = chartW - padL;
  const innerH = chartH - padB;

  const months = getMonths(monthYear);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const active = categories.filter((cat) =>
    months.some((m) => allExpenses.some((e) => e.categoryId === cat.id && e.date.startsWith(m)))
  );

  if (active.length === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Text style={styles.emptyIcon}>📈</Text>
        <Text style={[styles.emptyText, { color: t.textMuted }]}>Track expenses to see trends</Text>
      </View>
    );
  }

  const visibleCats = active.filter((c) => !hidden.has(c.id));
  const seriesData = visibleCats.map((cat) => ({
    color: CATEGORY_COLORS[cat.color] ?? t.primary,
    values: months.map((m) =>
      allExpenses.filter((e) => e.categoryId === cat.id && e.date.startsWith(m)).reduce((s, e) => s + e.amountCents, 0) / 100
    ),
  }));

  const allVals = seriesData.flatMap((s) => s.values);
  const maxVal = Math.max(...allVals, 1);

  const toX = (i: number) => padL + (i / (months.length - 1)) * innerW;
  const toY = (v: number) => ((maxVal - v) / maxVal) * innerH;

  const fmtY = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${Math.round(v)}`);

  return (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }]}>
      <Text style={[styles.label, { color: t.textMuted }]}>3-MONTH TREND</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toggleScroll}>
        <View style={styles.toggleRow}>
          {active.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() =>
                setHidden((prev) => {
                  const n = new Set(prev);
                  n.has(cat.id) ? n.delete(cat.id) : n.add(cat.id);
                  return n;
                })
              }
              style={[
                styles.toggle,
                {
                  backgroundColor: hidden.has(cat.id) ? t.inputBg : `${CATEGORY_COLORS[cat.color]}22`,
                  borderColor: hidden.has(cat.id) ? t.border : CATEGORY_COLORS[cat.color] ?? t.primary,
                },
              ]}
            >
              <Text style={[styles.toggleText, { color: hidden.has(cat.id) ? t.textMuted : (CATEGORY_COLORS[cat.color] ?? t.primary) }]}>
                {cat.icon} {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {seriesData.length > 0 && (
        <Svg width={chartW} height={chartH}>
          {/* Y axis labels */}
          {[0, 0.5, 1].map((frac, i) => (
            <SvgText key={i} x={padL - 4} y={toY(maxVal * (1 - frac)) + 4} textAnchor="end" fill={t.textMuted} fontSize={8}>
              {fmtY(maxVal * (1 - frac))}
            </SvgText>
          ))}
          {/* X axis labels */}
          {months.map((m, i) => (
            <SvgText key={m} x={toX(i)} y={chartH - 2} textAnchor="middle" fill={t.textMuted} fontSize={9}>
              {shortMonth(m)}
            </SvgText>
          ))}
          {/* Grid lines */}
          {[0, 0.5, 1].map((frac, i) => (
            <Line key={i} x1={padL} y1={toY(maxVal * (1 - frac))} x2={chartW} y2={toY(maxVal * (1 - frac))} stroke={t.border} strokeWidth={0.5} />
          ))}
          {/* Lines per series */}
          {seriesData.map((s, si) => {
            const pts = s.values.map((v, i) => ({ x: toX(i), y: toY(v) }));
            const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            return (
              <>
                <Path key={`line-${si}`} d={d} stroke={s.color} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, pi) => (
                  <Circle key={`dot-${si}-${pi}`} cx={p.x} cy={p.y} r={3} fill={s.color} />
                ))}
              </>
            );
          })}
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  empty: { alignItems: "center", justifyContent: "center", minHeight: 160 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 13 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  toggleScroll: { marginBottom: 12 },
  toggleRow: { flexDirection: "row", gap: 6 },
  toggle: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, borderWidth: 1 },
  toggleText: { fontSize: 11, fontWeight: "500" },
});
