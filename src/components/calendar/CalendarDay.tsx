import { EventPill } from "./EventPill";
import { formatCurrency } from "@/lib/utils";
import type { DailyBalance } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  date: string; // "YYYY-MM-DD"
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  balance: DailyBalance | undefined;
  onClick: () => void;
}

export function CalendarDay({
  date,
  dayNumber,
  isCurrentMonth,
  isToday,
  isSelected,
  balance,
  onClick,
}: CalendarDayProps) {
  const hasEvents = (balance?.events.length ?? 0) > 0;
  const maxPills = 2;
  const overflowCount = (balance?.events.length ?? 0) - maxPills;

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-2 min-h-[90px] border-b border-r cursor-pointer transition-colors select-none",
        isSelected && "ring-2 ring-indigo-500 ring-inset",
        !isCurrentMonth && "opacity-40"
      )}
      style={{
        background: isSelected
          ? "#eef2ff"
          : isToday
            ? "#fef9c3"
            : "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Day number */}
      <div className="flex justify-end mb-1">
        <span
          className={cn(
            "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
            isToday && "text-white"
          )}
          style={{
            background: isToday ? "#6366f1" : "transparent",
            color: isToday ? "white" : "var(--text-primary)",
          }}
        >
          {dayNumber}
        </span>
      </div>

      {/* Event pills */}
      <div className="space-y-0.5">
        {balance?.events.slice(0, maxPills).map((ev, i) => (
          <EventPill key={i} occurrence={ev} />
        ))}
        {overflowCount > 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            +{overflowCount} more
          </span>
        )}
      </div>

      {/* Projected balance */}
      {balance && isCurrentMonth && (
        <div className="mt-1">
          <span
            className="text-xs font-medium tabular-nums"
            style={{
              color: balance.projectedBalance >= 0 ? "#10b981" : "#ef4444",
            }}
          >
            {formatCurrency(balance.projectedBalance)}
          </span>
        </div>
      )}
    </div>
  );
}
