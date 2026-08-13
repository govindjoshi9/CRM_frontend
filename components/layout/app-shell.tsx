"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { getModule } from "@/lib/modules";

interface AppShellProps {
  children: React.ReactNode;
  /** currently selected module slug */
  activeSlug: string;
  /** switch the active module */
  onNavigate: (slug: string) => void;
}

export function AppShell({ children, activeSlug, onNavigate }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeModule = getModule(activeSlug);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar activeSlug={activeSlug} onNavigate={onNavigate} />
      </div>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            activeSlug={activeSlug}
            onNavigate={(s) => {
              onNavigate(s);
              setMobileOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        {/* Breadcrumb / page title */}
        {activeModule && (
          <div className="border-b border-border bg-background/50 px-4 py-2.5 md:px-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-wider">{activeModule.group}</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium text-foreground">{activeModule.label}</span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
