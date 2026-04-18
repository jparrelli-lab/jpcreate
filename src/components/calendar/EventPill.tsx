import { View, Text, StyleSheet } from "react-native";
import type { RecurringOccurrence } from "@/types";

interface EventPillProps {
  occurrence: RecurringOccurrence;
}

export function EventPill({ occurrence }: EventPillProps) {
  const isIncome = occurrence.type === "income";
  return (
    <View style={[styles.pill, { backgroundColor: isIncome ? "#d1fae5" : "#fee2e2" }]}>
      <Text style={[styles.text, { color: isIncome ? "#065f46" : "#991b1b" }]} numberOfLines={1}>
        {occurrence.name.length > 10 ? occurrence.name.slice(0, 9) + "…" : occurrence.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1, marginBottom: 2 },
  text: { fontSize: 9, fontWeight: "600" },
});
