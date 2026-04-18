"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, CalendarDays, Target, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/tracker", icon: BarChart2, label: "Tracker" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/budget", icon: Target, label: "Budget" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col shrink-0 h-full"
      style={{ width: "220px", background: "#1e1e2e" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div
          className="flex items-center justify-center rounded-lg w-8 h-8"
          style={{ background: "#6366f1" }}
        >
          <Wallet size={16} color="white" />
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">
          Budget
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "text-white bg-white/10"
                  : "hover:text-white hover:bg-white/5"
              )}
              style={{ color: active ? "white" : "#a0a0b8" }}
            >
              {active && (
                <span
                  className="absolute left-3 w-0.5 h-5 rounded-full"
                  style={{
                    background: "#6366f1",
                    marginLeft: "-12px",
                  }}
                />
              )}
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 text-xs border-t border-white/5"
        style={{ color: "#a0a0b8" }}
      >
        Local · Private
      </div>
    </aside>
  );
}
