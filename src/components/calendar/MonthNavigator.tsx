"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "@/lib/utils";

interface MonthNavigatorProps {
  monthYear: string;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNavigator({ monthYear, onPrev, onNext }: MonthNavigatorProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
      >
        <ChevronLeft size={18} />
      </button>
      <h2 className="text-lg font-bold flex-1 text-center" style={{ color: "var(--text-primary)" }}>
        {formatMonthYear(monthYear)}
      </h2>
      <button
        onClick={onNext}
        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
