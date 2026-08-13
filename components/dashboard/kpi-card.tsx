"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number; // percentage, e.g. +12.4 or -3.1
  icon: LucideIcon;
  tone?: "emerald" | "amber" | "rose" | "violet" | "slate";
  hint?: string;
}

const TONES: Record<
  NonNullable<KpiCardProps["tone"]>,
  { bg: string; text: string; ring: string }
> = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/20",
  },
  slate: {
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-300",
    ring: "ring-slate-500/20",
  },
};

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "emerald",
  hint,
}: KpiCardProps) {
  const tones = TONES[tone];
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="card-hover relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {hint && (
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
            tones.bg,
            tones.text,
            tones.ring
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  );
}
