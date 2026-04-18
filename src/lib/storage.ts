import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Category, Expense, Budget, RecurringItem, AppMeta } from "@/types";

export const STORAGE_KEYS = {
  categories: "budgetapp:categories",
  expenses: "budgetapp:expenses",
  budgets: "budgetapp:budgets",
  recurring: "budgetapp:recurring",
  meta: "budgetapp:meta",
} as const;

// In-memory cache — loaded once at app start, all reads are synchronous
const cache: Record<string, unknown> = {};

export async function initStorage(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  const pairs = await Promise.all(keys.map(async (k) => [k, await AsyncStorage.getItem(k)] as [string, string | null]));
  for (const [key, raw] of pairs) {
    if (raw) {
      try {
        cache[key] = JSON.parse(raw);
      } catch {
        // ignore corrupt entries
      }
    }
  }
}

export function read<T>(key: string): T | null {
  return (cache[key] as T) ?? null;
}

export function write<T>(key: string, data: T): void {
  cache[key] = data;
  // async flush — fire and forget
  AsyncStorage.setItem(key, JSON.stringify(data)).catch(() => {});
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
