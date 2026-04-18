"use client";

import { create } from "zustand";
import { getCurrentMonthYear, getTodayString } from "@/lib/utils";

interface AppStore {
  selectedMonthYear: string;
  setSelectedMonthYear: (m: string) => void;

  isAddExpenseOpen: boolean;
  setAddExpenseOpen: (open: boolean) => void;
  prefillCategoryId: string | undefined;
  setPrefillCategoryId: (id: string | undefined) => void;

  selectedCalendarDate: string | null;
  setSelectedCalendarDate: (d: string | null) => void;

  editingCategoryId: string | null;
  setEditingCategoryId: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedMonthYear: getCurrentMonthYear(),
  setSelectedMonthYear: (m) => set({ selectedMonthYear: m }),

  isAddExpenseOpen: false,
  setAddExpenseOpen: (open) => set({ isAddExpenseOpen: open }),
  prefillCategoryId: undefined,
  setPrefillCategoryId: (id) => set({ prefillCategoryId: id }),

  selectedCalendarDate: getTodayString(),
  setSelectedCalendarDate: (d) => set({ selectedCalendarDate: d }),

  editingCategoryId: null,
  setEditingCategoryId: (id) => set({ editingCategoryId: id }),
}));
