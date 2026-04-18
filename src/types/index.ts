export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // tailwind color key e.g. "rose", "blue", "amber"
  isDefault: boolean;
}

export interface Expense {
  id: string;
  amountCents: number; // stored in cents, always positive integer
  categoryId: string;
  note: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string; // ISO timestamp
}

export interface Budget {
  id: string;
  categoryId: string;
  monthYear: string; // "YYYY-MM"
  limitCents: number;
}

export type RecurringType = "income" | "bill";
export type RecurringFrequency = "weekly" | "biweekly" | "monthly" | "yearly";

export interface RecurringItem {
  id: string;
  type: RecurringType;
  name: string;
  amountCents: number;
  frequency: RecurringFrequency;
  dayOfMonth: number; // 1-31 for monthly; for weekly = day of week 0-6
  startDate: string; // "YYYY-MM-DD"
  endDate?: string;
  categoryId?: string;
}

export interface DailyBalance {
  date: string; // "YYYY-MM-DD"
  projectedBalance: number; // in cents
  events: RecurringOccurrence[];
}

export interface RecurringOccurrence {
  recurringItemId: string;
  type: RecurringType;
  name: string;
  amountCents: number;
}

export interface SpendingInsight {
  id: string;
  severity: "info" | "warning" | "over";
  category: Category;
  message: string;
  percentOfBudget: number;
  trend?: "up" | "down" | "stable";
  trendPercent?: number;
}

export interface AppMeta {
  version: number;
  createdAt: string;
  startingBalanceCents: number;
}
