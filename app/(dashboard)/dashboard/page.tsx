"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IndianRupee,
  FileText,
  Users,
  Wallet,
  ArrowUpRight,
  Plus,
  Download,
  Sparkles,
  Activity,
  ChevronRight,
  Code2,
  Database,
  CheckCircle2,
  Circle,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MODULES,
  getModule,
  TOTAL_MODULE_COUNT,
  READY_MODULE_COUNT,
  type ModuleDef,
} from "@/lib/modules";
import { API_BASE_URL } from "@/lib/api";
import { ItemsModule } from "@/components/modules/items-module";
import { LoginCard } from "@/components/auth/login-card";

const REVENUE_DATA = [
  { m: "Jan", revenue: 842000, expense: 612000 },
  { m: "Feb", revenue: 918000, expense: 638000 },
  { m: "Mar", revenue: 1024000, expense: 691000 },
  { m: "Apr", revenue: 1158000, expense: 742000 },
  { m: "May", revenue: 1291000, expense: 789000 },
  { m: "Jun", revenue: 1384000, expense: 812000 },
  { m: "Jul", revenue: 1512000, expense: 847000 },
  { m: "Aug", revenue: 1628000, expense: 893000 },
];

const ACTIVITY = [
  { icon: FileText, tone: "emerald", title: "Invoice INV-2024-1187 created", meta: "Acme Industries · ₹84,500", time: "2 min ago" },
  { icon: Users, tone: "violet", title: "New lead: Priya Sharma", meta: "Web form · Score 78", time: "14 min ago" },
  { icon: Wallet, tone: "amber", title: "Payment received", meta: "UTR-8849201 · ₹1,20,000", time: "1 hr ago" },
  { icon: AlertCircle, tone: "rose", title: "Stock low: Widget XL", meta: "Warehouse West · 4 units left", time: "2 hr ago" },
  { icon: FileText, tone: "emerald", title: "Purchase bill parsed via OCR", meta: "Vendor: Sony India · ₹56,200", time: "3 hr ago" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("m") || "dashboard";
  const [loginOpen, setLoginOpen] = useState(false);

  const handleNavigate = useCallback(
    (slug: string) => {
      if (slug === "dashboard") {
        router.push("/dashboard");
      } else {
        router.push(`/dashboard?m=${slug}`);
      }
    },
    [router]
  );

  const activeModule = getModule(activeSlug);

  return (
    <AppShell activeSlug={activeSlug} onNavigate={handleNavigate}>
      {activeSlug === "dashboard" || !activeModule ? (
        <DashboardView onTryLogin={() => setLoginOpen(true)} />
      ) : activeSlug === "items" ? (
        <ItemsModule />
      ) : (
        <ModulePreviewView module={activeModule} />
      )}

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </AppShell>
  );
}

function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-md" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Sign in to Zamtrix</DialogTitle>
        <DialogDescription className="sr-only">
          Enter your email and password to access the ERP dashboard.
        </DialogDescription>
        <LoginCard compact redirectTo="/" />
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------- Dashboard view ----------------------------- */

function DashboardView({ onTryLogin }: { onTryLogin: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening across your business today."
        icon={Sparkles}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="gap-1.5" onClick={onTryLogin}>
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          </>
        }
      />

      <SetupBanner onTryLogin={onTryLogin} />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Revenue" value="₹16.28L" delta={7.4} icon={IndianRupee} tone="emerald" hint="This month" />
        <KpiCard label="Invoices Issued" value="248" delta={3.1} icon={FileText} tone="amber" hint="42 pending" />
        <KpiCard label="Active Leads" value="36" delta={-2.4} icon={Users} tone="violet" hint="12 hot · 8 cold" />
        <KpiCard label="Receivables" value="₹4.82L" delta={1.2} icon={Wallet} tone="rose" hint="Due in 7 days" />
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue vs Expenses</h3>
              <p className="text-xs text-muted-foreground">Last 8 months · in ₹</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Expense
              </span>
            </div>
          </div>
          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                    boxShadow: "0 8px 24px -12px rgba(15,23,42,0.18)",
                  }}
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gRev)" />
                <Area type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View all
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="mt-2 h-[280px] pr-2">
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                const toneMap: Record<string, string> = {
                  emerald: "bg-emerald-500/10 text-emerald-600",
                  amber: "bg-amber-500/10 text-amber-600",
                  rose: "bg-rose-500/10 text-rose-600",
                  violet: "bg-violet-500/10 text-violet-600",
                };
                return (
                  <div key={i} className="flex gap-3 py-2.5">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneMap[a.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <QuickActions />
        <ModuleStatus />
      </div>
    </div>
  );
}

function SetupBanner({ onTryLogin }: { onTryLogin: () => void }) {
  const isDefault = API_BASE_URL === "http://localhost:5000";
  return (
    <Card className="border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
          <Database className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {isDefault
              ? "Connect your backend to enable live data"
              : "Backend connected — ready to sign in"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isDefault ? (
              <>
                Set <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">NEXT_PUBLIC_API_BASE_URL</code> in{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">.env.local</code> to your deployed backend URL
                (e.g. your Caprover app URL). Default login works:{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">admin@erp.com / admin123</code>
              </>
            ) : (
              <>
                API base: <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">{API_BASE_URL}</code>. Click
                <strong> Sign in</strong> to authenticate with the backend.
              </>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={onTryLogin}
        >
          <LogIn className="h-3.5 w-3.5" />
          Try Login
        </Button>
      </div>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { label: "New Invoice", icon: FileText, tone: "bg-emerald-500/10 text-emerald-600" },
    { label: "Add Lead", icon: Users, tone: "bg-violet-500/10 text-violet-600" },
    { label: "Record Payment", icon: Wallet, tone: "bg-amber-500/10 text-amber-600" },
    { label: "Create Quotation", icon: FileText, tone: "bg-rose-500/10 text-rose-600" },
    { label: "Add Item", icon: Plus, tone: "bg-sky-500/10 text-sky-600" },
    { label: "Purchase Bill", icon: FileText, tone: "bg-indigo-500/10 text-indigo-600" },
  ];
  return (
    <Card className="p-5 xl:col-span-2">
      <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
      <p className="text-xs text-muted-foreground">Jump straight into the most-used workflows</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
              <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ModuleStatus() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Module Coverage</h3>
        <Badge variant="outline" className="gap-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {READY_MODULE_COUNT}/{TOTAL_MODULE_COUNT} ready
        </Badge>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Backend exposes {TOTAL_MODULE_COUNT} modules. {READY_MODULE_COUNT} have UI in this starter.
      </p>
      <Separator className="my-3" />
      <ScrollArea className="h-[260px] pr-2">
        <div className="flex flex-col gap-1.5">
          {MODULES.slice(0, 12).map((m) => (
            <div key={m.slug} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/60">
              {m.status === "ready" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
              )}
              <span className="flex-1 truncate text-foreground">{m.label}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.status}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

/* --------------------------- Module preview view --------------------------- */

function ModulePreviewView({ module: m }: { module: ModuleDef }) {
  const Icon = m.icon;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={m.label}
        description={m.description}
        icon={Icon}
        actions={
          <Button size="sm" variant="outline" className="gap-1.5">
            <Code2 className="h-4 w-4" />
            View API Spec
          </Button>
        }
      />

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">{m.label} — coming up next</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This module's REST endpoints are already wired up on the backend at{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{m.prefix || "/"}</code>. Build the UI by
              following the pattern from the <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">Items</code> page
              and the <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">FRONTEND_QUICKSTART.md</code> guide.
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">API Endpoints</h4>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Method</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Path</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Roles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {m.endpoints.map((e, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-3 py-2">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${
                            e.method === "GET"
                              ? "border-emerald-500/40 text-emerald-600"
                              : e.method === "POST"
                                ? "border-amber-500/40 text-amber-600"
                                : e.method === "DELETE"
                                  ? "border-rose-500/40 text-rose-600"
                                  : "border-violet-500/40 text-violet-600"
                          }`}
                        >
                          {e.method}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {m.prefix}
                        <span className="text-muted-foreground">{e.path}</span>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{e.description}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {e.roles ? e.roles.join(", ") : "any auth"}
                      </td>
                    </tr>
                  ))}
                  {m.endpoints.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">
                        No REST endpoints documented for this module yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-muted/40 p-4">
          <p className="text-xs font-medium text-foreground">Quick start</p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-[11px] text-slate-100">
{`import { api } from "@/lib/api";

const items = await api.get("${m.prefix || "/api"}");
// → typed GET with JWT Bearer header injected automatically`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
