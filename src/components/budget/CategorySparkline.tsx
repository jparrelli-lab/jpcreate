import { View, StyleSheet } from "react-native";

interface CategorySparklineProps {
  history: { month: string; spentCents: number; limitCents: number }[];
}

export function CategorySparkline({ history }: CategorySparklineProps) {
  const maxVal = Math.max(...history.map((h) => h.spentCents), 1);
  return (
    <View style={styles.container}>
      {history.map((h, i) => {
        const pct = h.spentCents / maxVal;
        const over = h.limitCents > 0 && h.spentCents > h.limitCents;
        return (
          <View key={i} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(pct * 28, 2),
                  backgroundColor: over ? "#ef4444" : "#6366f1",
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-end", height: 28, gap: 4, width: 72 },
  barWrapper: { flex: 1, height: 28, justifyContent: "flex-end" },
  bar: { borderRadius: 2 },
});
