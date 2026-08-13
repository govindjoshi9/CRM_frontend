"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  MODULES,
  MODULE_GROUPS,
  getModulesByGroup,
  type ModuleDef,
  type ModuleGroup,
} from "@/lib/modules";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
}

export function Sidebar({ activeSlug, onNavigate }: SidebarProps) {
  const [query, setQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<ModuleGroup>>(new Set());

  const grouped = useMemo(() => getModulesByGroup(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return grouped;
    const q = query.toLowerCase();
    const result = {} as Record<ModuleGroup, ModuleDef[]>;
    for (const g of MODULE_GROUPS) result[g] = [];
    for (const m of MODULES) {
      if (
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q)
      ) {
        result[m.group].push(m);
      }
    }
    return result;
  }, [query, grouped]);

  function toggleGroup(g: ModuleGroup) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  return (
    <aside className="flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-white">
            Zamtrix ERP
          </span>
          <span className="text-[11px] text-sidebar-foreground/60">
            Business Suite
          </span>
        </div>
      </button>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules…"
            className="h-9 border-sidebar-border bg-sidebar-accent/60 pl-9 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus-visible:bg-sidebar-accent focus-visible:ring-sidebar-primary"
          />
        </div>
      </div>

      {/* Modules */}
      <ScrollArea className="sidebar-scroll flex-1 px-2 pb-4">
        <nav className="flex flex-col gap-0.5">
          {MODULE_GROUPS.map((group) => {
            const items = filtered[group];
            if (!items || items.length === 0) return null;
            const collapsed = collapsedGroups.has(group) && !query;
            return (
              <div key={group} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
                >
                  <span>{group}</span>
                  {!query && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        collapsed && "-rotate-90"
                      )}
                    />
                  )}
                </button>
                {!collapsed && (
                  <div className="flex flex-col gap-0.5">
                    {items.map((m) => (
                      <SidebarItem
                        key={m.slug}
                        module={m}
                        active={activeSlug === m.slug}
                        onClick={() => onNavigate(m.slug)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-sidebar-foreground/50">
          <span>v1.0 · Starter</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Backend configured
          </span>
        </div>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  module: ModuleDef;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ module: m, active, onClick }: SidebarItemProps) {
  const Icon: LucideIcon = m.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active
            ? "text-sidebar-primary-foreground"
            : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
        )}
      />
      <span className="flex-1 truncate text-left">{m.label}</span>
      {m.status === "preview" && (
        <Badge
          variant="outline"
          className="h-4 border-sidebar-border/60 px-1.5 text-[9px] font-medium uppercase text-sidebar-foreground/40"
        >
          soon
        </Badge>
      )}
    </button>
  );
}
