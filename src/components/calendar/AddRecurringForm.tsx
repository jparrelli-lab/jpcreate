"use client";

import { useState } from "react";
import { getTodayString, parseCentsFromInput } from "@/lib/utils";
import type { RecurringItem, RecurringFrequency, RecurringType } from "@/types";

interface AddRecurringFormProps {
  onSubmit: (data: Omit<RecurringItem, "id">) => void;
  onCancel: () => void;
}

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

export function AddRecurringForm({ onSubmit, onCancel }: AddRecurringFormProps) {
  const [type, setType] = useState<RecurringType>("income");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [startDate, setStartDate] = useState(getTodayString());

  const amountCents = parseCentsFromInput(amount);
  const isValid = name.trim() !== "" && amountCents > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ type, name: name.trim(), amountCents, frequency, dayOfMonth, startDate });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Type toggle */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Type
        </label>
        <div className="flex gap-2">
          {(["income", "bill"] as RecurringType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors capitalize"
              style={{
                background:
                  type === t
                    ? t === "income"
                      ? "#d1fae5"
                      : "#fee2e2"
                    : "var(--input-bg)",
                color:
                  type === t
                    ? t === "income"
                      ? "#065f46"
                      : "#991b1b"
                    : "var(--text-muted)",
                border: "1px solid var(--border-color)",
              }}
            >
              {t === "income" ? "💰 Income" : "📄 Bill"}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Name
        </label>
        <input
          type="text"
          placeholder={type === "income" ? "Paycheck, Freelance…" : "Rent, Netflix, Electricity…"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          autoFocus
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Amount
        </label>
        <div
          className="flex items-center rounded-xl px-4 py-3"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-color)" }}
        >
          <span className="mr-1 text-sm font-medium" style={{ color: "var(--text-muted)" }}>$</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-semibold tabular-nums"
            style={{ color: "var(--text-primary)" }}
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Frequency
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Day of month */}
      {(frequency === "monthly") && (
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Day of month
          </label>
          <input
            type="number"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
            min={1}
            max={31}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none tabular-nums"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      {/* Start date */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Start date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl py-3 text-sm font-semibold"
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
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
          style={{
            background: isValid ? "#6366f1" : "#6366f180",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Add
        </button>
      </div>
    </form>
  );
}
