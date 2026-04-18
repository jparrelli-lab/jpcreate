import type { Category, Expense, Budget, RecurringItem, AppMeta } from "@/types";

export const STORAGE_KEYS = {
  categories: "budgetapp:categories",
  expenses: "budgetapp:expenses",
  budgets: "budgetapp:budgets",
  recurring: "budgetapp:recurring",
  meta: "budgetapp:meta",
} as const;

export function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function write<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or private browsing
  }
}

export function isInitialized(): boolean {
  return read<AppMeta>(STORAGE_KEYS.meta) !== null;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_housing", name: "Housing", icon: "🏠", color: "slate", isDefault: true },
  { id: "cat_food", name: "Food & Dining", icon: "🍔", color: "amber", isDefault: true },
  { id: "cat_transport", name: "Transportation", icon: "🚗", color: "blue", isDefault: true },
  { id: "cat_entertainment", name: "Entertainment", icon: "🎬", color: "purple", isDefault: true },
  { id: "cat_shopping", name: "Shopping", icon: "🛍️", color: "pink", isDefault: true },
  { id: "cat_health", name: "Healthcare", icon: "💊", color: "red", isDefault: true },
  { id: "cat_utilities", name: "Utilities", icon: "⚡", color: "yellow", isDefault: true },
  { id: "cat_subscriptions", name: "Subscriptions", icon: "📱", color: "indigo", isDefault: true },
  { id: "cat_personal", name: "Personal", icon: "✂️", color: "teal", isDefault: true },
  { id: "cat_savings", name: "Savings", icon: "🏦", color: "emerald", isDefault: true },
];

export function initializeDefaults(): void {
  if (isInitialized()) return;

  write<Category[]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
  write<Expense[]>(STORAGE_KEYS.expenses, []);
  write<Budget[]>(STORAGE_KEYS.budgets, []);
  write<RecurringItem[]>(STORAGE_KEYS.recurring, []);
  write<AppMeta>(STORAGE_KEYS.meta, {
    version: 1,
    createdAt: new Date().toISOString(),
    startingBalanceCents: 0,
  });
}
