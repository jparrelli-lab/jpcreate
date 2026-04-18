import type { RecurringOccurrence } from "@/types";

interface EventPillProps {
  occurrence: RecurringOccurrence;
}

export function EventPill({ occurrence }: EventPillProps) {
  const isIncome = occurrence.type === "income";
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded-md font-medium truncate block max-w-full"
      style={{
        background: isIncome ? "#d1fae5" : "#fee2e2",
        color: isIncome ? "#065f46" : "#991b1b",
      }}
      title={occurrence.name}
    >
      {occurrence.name.length > 12 ? occurrence.name.slice(0, 11) + "…" : occurrence.name}
    </span>
  );
}
