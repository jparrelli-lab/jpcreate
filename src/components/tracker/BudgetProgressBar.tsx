import { cn } from "@/lib/utils";

interface BudgetProgressBarProps {
  percent: number;
  className?: string;
  height?: string;
}

export function BudgetProgressBar({
  percent,
  className,
  height = "h-2",
}: BudgetProgressBarProps) {
  const clamped = Math.min(percent, 100);
  const color =
    percent >= 100
      ? "bg-red-500"
      : percent >= 80
        ? "bg-amber-500"
        : "bg-emerald-500";
  const overPulse = percent >= 100 ? "animate-pulse" : "";

  return (
    <div
      className={cn("w-full rounded-full overflow-hidden", height, className)}
      style={{ background: "var(--border-color)" }}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", color, overPulse)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
