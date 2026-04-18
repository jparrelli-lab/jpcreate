import { nanoid } from "nanoid";
import { read, write, STORAGE_KEYS } from "./storage";
import type { Category, Expense, Budget, RecurringItem, AppMeta } from "@/types";

// ─── Categories ───────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return read<Category[]>(STORAGE_KEYS.categories) ?? [];
}

export function addCategory(input: Omit<Category, "id">): Category {
  const categories = getCategories();
  const category: Category = { ...input, id: nanoid(7) };
  write(STORAGE_KEYS.categories, [...categories, category]);
  return category;
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export function getExpenses(filters?: { monthYear?: string; categoryId?: string }): Expense[] {
  const all = read<Expense[]>(STORAGE_KEYS.expenses) ?? [];
  return all.filter((e) => {
    if (filters?.monthYear && !e.date.startsWith(filters.monthYear)) return false;
    if (filters?.categoryId && e.categoryId !== filters.categoryId) return false;
    return true;
  });
}

export function addExpense(input: Omit<Expense, "id" | "createdAt">): Expense {
  const expenses = read<Expense[]>(STORAGE_KEYS.expenses) ?? [];
  const expense: Expense = { ...input, id: nanoid(7), createdAt: new Date().toISOString() };
  write(STORAGE_KEYS.expenses, [expense, ...expenses]);
  return expense;
}

export function updateExpense(id: string, patch: Partial<Expense>): Expense {
  const expenses = read<Expense[]>(STORAGE_KEYS.expenses) ?? [];
  const updated = expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
  write(STORAGE_KEYS.expenses, updated);
  return updated.find((e) => e.id === id)!;
}

export function deleteExpense(id: string): void {
  const expenses = read<Expense[]>(STORAGE_KEYS.expenses) ?? [];
  write(STORAGE_KEYS.expenses, expenses.filter((e) => e.id !== id));
}

// ─── Budgets ──────────────────────────────────────────────────────────────────

export function getBudgets(monthYear: string): Budget[] {
  const all = read<Budget[]>(STORAGE_KEYS.budgets) ?? [];
  return all.filter((b) => b.monthYear === monthYear);
}

export function getAllBudgets(): Budget[] {
  return read<Budget[]>(STORAGE_KEYS.budgets) ?? [];
}

export function upsertBudget(categoryId: string, monthYear: string, limitCents: number): Budget {
  const all = read<Budget[]>(STORAGE_KEYS.budgets) ?? [];
  const existing = all.find((b) => b.categoryId === categoryId && b.monthYear === monthYear);
  if (existing) {
    const updated = all.map((b) =>
      b.id === existing.id ? { ...b, limitCents } : b
    );
    write(STORAGE_KEYS.budgets, updated);
    return { ...existing, limitCents };
  }
  const budget: Budget = { id: nanoid(7), categoryId, monthYear, limitCents };
  write(STORAGE_KEYS.budgets, [...all, budget]);
  return budget;
}

// ─── Recurring Items ──────────────────────────────────────────────────────────

export function getRecurringItems(): RecurringItem[] {
  return read<RecurringItem[]>(STORAGE_KEYS.recurring) ?? [];
}

export function addRecurringItem(input: Omit<RecurringItem, "id">): RecurringItem {
  const items = getRecurringItems();
  const item: RecurringItem = { ...input, id: nanoid(7) };
  write(STORAGE_KEYS.recurring, [...items, item]);
  return item;
}

export function updateRecurringItem(id: string, patch: Partial<RecurringItem>): RecurringItem {
  const items = getRecurringItems();
  const updated = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
  write(STORAGE_KEYS.recurring, updated);
  return updated.find((i) => i.id === id)!;
}

export function deleteRecurringItem(id: string): void {
  const items = getRecurringItems();
  write(STORAGE_KEYS.recurring, items.filter((i) => i.id !== id));
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function getMeta(): AppMeta {
  return (
    read<AppMeta>(STORAGE_KEYS.meta) ?? {
      version: 1,
      createdAt: new Date().toISOString(),
      startingBalanceCents: 0,
    }
  );
}

export function updateMeta(patch: Partial<AppMeta>): AppMeta {
  const meta = getMeta();
  const updated = { ...meta, ...patch };
  write(STORAGE_KEYS.meta, updated);
  return updated;
}
