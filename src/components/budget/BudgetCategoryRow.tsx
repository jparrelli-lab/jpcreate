"use client";

import { useState, useRef } from "react";
import { Check } from "lucide-react";
import { formatCurrency, centsToDisplayValue, parseCentsFromInput } from "@/lib/utils";
import { CategorySparkline } from "./CategorySparkline";
import { BudgetProgressBar } from "@/components/tracker/BudgetProgressBar";
import type { Category } from "@/types";

interface BudgetCategoryRowProps {
  category: Category;
  limitCents: number;
  spentCents: number;
  history: { month: string; spentCents: number; limitCents: number }[];
  onSave: (cents: number) => void;
}

export function BudgetCategoryRow({
  category,
  limitCents,
  spentCents,
  history,
  onSave,
}: BudgetCategoryRowProps) {
  const [value, setValue] = useState(limitCents > 0 ? centsToDisplayValue(limitCents) : "");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const cents = parseCentsFromInput(value);
    onSave(cents);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const percent = limitCents > 0 ? (spentCents / limitCents) * 100 : 0;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
      style={{ borderColor: "var(--border-color)" }}
    >
      <span className="text-xl shrink-0">{category.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {category.name}
          </span>
          {spentCents > 0 && (
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
              {formatCurrency(spentCents)} spent
            </span>
          )}
        </div>
        {limitCents > 0 && (
          <BudgetProgressBar percent={percent} height="h-1" className="mt-1.5" />
        )}
      </div>

      <CategorySparkline history={history} />

      {/* Budget input */}
      <div
        className="flex items-center gap-1 rounded-lg px-2 py-1.5"
        style={{ background: "var(--input-bg)", border: "1px solid var(--border-color)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>$</span>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Budget"
          className="w-20 bg-transparent outline-none text-sm tabular-nums font-medium"
          style={{ color: "var(--text-primary)" }}
          min="0"
          step="1"
        />
      </div>

      <div className="w-5 h-5 flex items-center justify-center">
        {saved && (
          <span style={{ color: "#10b981" }}>
            <Check size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
