"use client";

import { useState, useRef, useEffect } from "react";
import { getTodayString, parseCentsFromInput } from "@/lib/utils";
import type { Category } from "@/types";

interface AddExpenseFormProps {
  categories: Category[];
  prefillCategoryId?: string;
  onSubmit: (data: {
    amountCents: number;
    categoryId: string;
    note: string;
    date: string;
  }) => void;
  onCancel: () => void;
}

export function AddExpenseForm({
  categories,
  prefillCategoryId,
  onSubmit,
  onCancel,
}: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(prefillCategoryId ?? "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [showDate, setShowDate] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => amountRef.current?.focus(), 100);
  }, []);

  const amountCents = parseCentsFromInput(amount);
  const isValid = amountCents > 0 && categoryId !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ amountCents, categoryId, note, date });
    setAmount("");
    setCategoryId(prefillCategoryId ?? "");
    setNote("");
    setDate(getTodayString());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Amount
        </label>
        <div
          className="flex items-center rounded-xl px-4 py-3 text-2xl font-bold"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-color)" }}
        >
          <span className="mr-1" style={{ color: "var(--text-muted)" }}>$</span>
          <input
            ref={amountRef}
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none tabular-nums w-full"
            style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Category
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0"
              style={{
                border: categoryId === cat.id ? "2px solid #6366f1" : "1px solid var(--border-color)",
                background: categoryId === cat.id ? "#6366f120" : "var(--input-bg)",
                color: categoryId === cat.id ? "#6366f1" : "var(--text-muted)",
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Note <span className="normal-case font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="What was it for?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Date (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowDate(!showDate)}
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: "var(--text-muted)" }}
        >
          📅 {date === getTodayString() ? "Today" : date}
          <span className="ml-1">{showDate ? "▲" : "▼"}</span>
        </button>
        {showDate && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity"
          style={{
            background: isValid ? "#6366f1" : "#6366f180",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Save Expense
        </button>
      </div>
    </form>
  );
}
