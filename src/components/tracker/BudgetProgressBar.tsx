import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme/colors";

interface BudgetProgressBarProps {
  percent: number;
  height?: number;
}

export function BudgetProgressBar({ percent, height = 6 }: BudgetProgressBarProps) {
  const t = useTheme();
  const clamped = Math.min(percent, 100);
  const barColor = percent >= 100 ? "#ef4444" : percent >= 80 ? "#f59e0b" : "#10b981";

  return (
    <View style={[styles.track, { height, backgroundColor: t.border }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: barColor, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", borderRadius: 99, overflow: "hidden" },
  fill: { borderRadius: 99 },
});
