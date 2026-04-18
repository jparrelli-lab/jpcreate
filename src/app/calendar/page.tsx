"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MonthNavigator } from "@/components/calendar/MonthNavigator";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetailPanel } from "@/components/calendar/DayDetailPanel";
import { RunningBalanceChart } from "@/components/calendar/RunningBalanceChart";
import { AddRecurringForm } from "@/components/calendar/AddRecurringForm";
import { useAppStore } from "@/store/appStore";
import { useRecurring } from "@/hooks/useRecurring";
import { useCashFlow } from "@/hooks/useCashFlow";
import { getMeta, updateMeta } from "@/lib/db";
import { formatCurrency, parseCentsFromInput } from "@/lib/utils";
import { Drawer } from "vaul";

export default function CalendarPage() {
  const { selectedMonthYear, setSelectedMonthYear, selectedCalendarDate, setSelectedCalendarDate } =
    useAppStore();
  const { items, addItem, deleteItem } = useRecurring();
  const [startingBalance, setStartingBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState("");
  const [editingBalance, setEditingBalance] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const meta = getMeta();
    setStartingBalance(meta.startingBalanceCents);
    setBalanceInput((meta.startingBalanceCents / 100).toFixed(2));
  }, []);

  const dailyBalances = useCashFlow(selectedMonthYear, items, startingBalance);
  const selectedBalance = dailyBalances.find((d) => d.date === selectedCalendarDate);

  function navigateMonth(dir: -1 | 1) {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const d = new Date(year, month - 1 + dir, 1);
    setSelectedMonthYear(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  function saveBalance() {
    const cents = parseCentsFromInput(balanceInput);
    setStartingBalance(cents);
    updateMeta({ startingBalanceCents: cents });
    setEditingBalance(false);
  }

  const incomeItems = items.filter((i) => i.type === "income");
  const billItems = items.filter((i) => i.type === "bill");

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Cash Flow
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#6366f1" }}
        >
          <Plus size={16} />
          Add Income / Bill
        </button>
      </div>

      {/* Starting balance */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
      >
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            STARTING BALANCE
          </p>
          {editingBalance ? (
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: "var(--text-muted)" }}>$</span>
              <input
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="w-32 bg-transparent outline-none text-lg font-bold tabular-nums"
                style={{ color: "var(--text-primary)" }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveBalance()}
              />
              <button
                onClick={saveBalance}
                className="text-xs px-2 py-1 rounded-lg font-medium text-white"
                style={{ background: "#6366f1" }}
              >
                Save
              </button>
            </div>
          ) : (
            <p
              className="text-xl font-bold tabular-nums cursor-pointer hover:opacity-70 transition-opacity mt-1"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setEditingBalance(true)}
            >
              {formatCurrency(startingBalance)}
            </p>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Click balance to edit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Calendar */}
        <div className="lg:col-span-2">
          <MonthNavigator
            monthYear={selectedMonthYear}
            onPrev={() => navigateMonth(-1)}
            onNext={() => navigateMonth(1)}
          />
          <CalendarGrid
            monthYear={selectedMonthYear}
            dailyBalances={dailyBalances}
            selectedDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
          />
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <DayDetailPanel date={selectedCalendarDate} balance={selectedBalance} />
          <RunningBalanceChart dailyBalances={dailyBalances} selectedDate={selectedCalendarDate} />

          {/* Recurring items list */}
          {(incomeItems.length > 0 || billItems.length > 0) && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
            >
              {incomeItems.length > 0 && (
                <>
                  <div
                    className="px-4 py-2 border-b text-xs font-semibold"
                    style={{ borderColor: "var(--border-color)", color: "#10b981" }}
                  >
                    INCOME
                  </div>
                  {incomeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 border-b group"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {item.name}
                        </p>
                        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                          {item.frequency} · day {item.dayOfMonth}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums" style={{ color: "#10b981" }}>
                          +{formatCurrency(item.amountCents)}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {billItems.length > 0 && (
                <>
                  <div
                    className="px-4 py-2 border-b text-xs font-semibold"
                    style={{ borderColor: "var(--border-color)", color: "#ef4444" }}
                  >
                    BILLS
                  </div>
                  {billItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 border-b last:border-0 group"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {item.name}
                        </p>
                        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                          {item.frequency} · day {item.dayOfMonth}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums" style={{ color: "#ef4444" }}>
                          -{formatCurrency(item.amountCents)}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Recurring Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl flex flex-col max-h-[90vh]"
            style={{ background: "var(--bg-card)", boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-color)" }} />
            </div>
            <div className="px-6 py-4 overflow-y-auto">
              <Drawer.Title className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
                Add Income / Bill
              </Drawer.Title>
              <AddRecurringForm
                onSubmit={(data) => {
                  addItem(data);
                  setAddOpen(false);
                }}
                onCancel={() => setAddOpen(false)}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </PageWrapper>
  );
}
