"use client";

import { CalendarDay } from "./CalendarDay";
import { getDaysInMonth, getDay, startOfMonth } from "date-fns";
import type { DailyBalance } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  monthYear: string;
  dailyBalances: DailyBalance[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function padStr(n: number): string {
  return String(n).padStart(2, "0");
}

export function CalendarGrid({
  monthYear,
  dailyBalances,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const [year, month] = monthYear.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const startOffset = getDay(firstDay); // 0=Sun
  const daysInMonth = getDaysInMonth(firstDay);

  // Previous month days to fill the first row
  const prevMonthDate = new Date(year, month - 2, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth() + 1;
  const daysInPrevMonth = getDaysInMonth(new Date(year, month - 2, 1));

  // Next month
  const nextMonthDate = new Date(year, month, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth() + 1;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${padStr(today.getMonth() + 1)}-${padStr(today.getDate())}`;

  const balanceMap = new Map(dailyBalances.map((d) => [d.date, d]));

  // Build grid cells
  const cells: { date: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Pre-fill from prev month
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({
      date: `${prevYear}-${padStr(prevMonth)}-${padStr(day)}`,
      dayNum: day,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: `${year}-${padStr(month)}-${padStr(d)}`,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Fill remaining cells for last row
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      date: `${nextYear}-${padStr(nextMonth)}-${padStr(d)}`,
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)" }}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--border-color)" }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold py-2"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell) => (
          <CalendarDay
            key={cell.date}
            date={cell.date}
            dayNumber={cell.dayNum}
            isCurrentMonth={cell.isCurrentMonth}
            isToday={cell.date === todayStr}
            isSelected={cell.date === selectedDate}
            balance={balanceMap.get(cell.date)}
            onClick={() => onSelectDate(cell.date)}
          />
        ))}
      </div>
    </div>
  );
}
