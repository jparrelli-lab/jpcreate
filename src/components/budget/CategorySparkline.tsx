import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "@/theme/colors";

interface CategorySparklineProps {
  history: { month: string; spentCents: number; limitCents: number }[];
}

export function CategorySparkline({ history }: CategorySparklineProps) {
  const t = useTheme();
  const data = history.map((h) => ({
    value: h.spentCents / 100,
    frontColor: h.limitCents > 0 && h.spentCents > h.limitCents ? "#ef4444" : "#6366f1",
    topLabelComponent: () => null,
  }));

  return (
    <BarChart
      data={data}
      width={72}
      height={28}
      barWidth={16}
      spacing={4}
      hideRules
      hideYAxisText
      xAxisColor="transparent"
      yAxisColor="transparent"
      barBorderRadius={2}
      noOfSections={1}
      maxValue={Math.max(...data.map((d) => d.value), 1)}
      xAxisThickness={0}
      yAxisThickness={0}
    />
  );
}
