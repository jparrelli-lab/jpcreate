"use client";

import { useState, useEffect, useCallback } from "react";
import * as db from "@/lib/db";
import type { RecurringItem } from "@/types";

export function useRecurring() {
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setItems(db.getRecurringItems());
  }, [refreshKey]);

  const addItem = useCallback(
    (input: Omit<RecurringItem, "id">) => {
      const created = db.addRecurringItem(input);
      refresh();
      return created;
    },
    [refresh]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<RecurringItem>) => {
      db.updateRecurringItem(id, patch);
      refresh();
    },
    [refresh]
  );

  const deleteItem = useCallback(
    (id: string) => {
      db.deleteRecurringItem(id);
      refresh();
    },
    [refresh]
  );

  return { items, addItem, updateItem, deleteItem, refresh };
}
