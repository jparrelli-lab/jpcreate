"use client";

import { Drawer } from "vaul";
import { AddExpenseForm } from "./AddExpenseForm";
import type { Category, Expense } from "@/types";

interface AddExpenseDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  prefillCategoryId?: string;
  onAdd: (data: Omit<Expense, "id" | "createdAt">) => void;
}

export function AddExpenseDrawer({
  open,
  onClose,
  categories,
  prefillCategoryId,
  onAdd,
}: AddExpenseDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl flex flex-col max-h-[90vh]"
          style={{ background: "var(--bg-card)", boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              className="w-10 h-1 rounded-full"
              style={{ background: "var(--border-color)" }}
            />
          </div>

          <div className="px-6 py-4 overflow-y-auto">
            <Drawer.Title className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Add Expense
            </Drawer.Title>
            <AddExpenseForm
              categories={categories}
              prefillCategoryId={prefillCategoryId}
              onSubmit={(data) => {
                onAdd(data);
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
