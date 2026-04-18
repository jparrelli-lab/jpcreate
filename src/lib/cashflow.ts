import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  parseISO,
  getDay,
  differenceInCalendarDays,
  getDaysInMonth,
} from "date-fns";
import type { RecurringItem, DailyBalance, RecurringOccurrence } from "@/types";

function firesOnDate(item: RecurringItem, date: Date): boolean {
  const start = parseISO(item.startDate);
  if (date < start) return false;
  if (item.endDate && date > parseISO(item.endDate)) return false;

  switch (item.frequency) {
    case "monthly": {
      const lastDay = getDaysInMonth(date);
      const targetDay = Math.min(item.dayOfMonth, lastDay);
      return date.getDate() === targetDay;
    }
    case "weekly":
      return getDay(date) === item.dayOfMonth;
    case "biweekly": {
      const diff = differenceInCalendarDays(date, start);
      return diff >= 0 && diff % 14 === 0;
    }
    case "yearly":
      return date.getMonth() + 1 === item.dayOfMonth && date.getDate() === 1;
  }
}

export function buildMonthlyBalances(
  monthYear: string,
  recurringItems: RecurringItem[],
  startingBalanceCents: number
): DailyBalance[] {
  const [year, month] = monthYear.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month - 1, getDaysInMonth(first));

  const days = eachDayOfInterval({ start: first, end: last });
  let runningBalance = startingBalanceCents;
  const result: DailyBalance[] = [];

  for (const day of days) {
    const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const events: RecurringOccurrence[] = [];

    for (const item of recurringItems) {
      if (firesOnDate(item, day)) {
        events.push({
          recurringItemId: item.id,
          type: item.type,
          name: item.name,
          amountCents: item.amountCents,
        });
        if (item.type === "income") {
          runningBalance += item.amountCents;
        } else {
          runningBalance -= item.amountCents;
        }
      }
    }

    result.push({ date: dayStr, projectedBalance: runningBalance, events });
  }

  return result;
}
