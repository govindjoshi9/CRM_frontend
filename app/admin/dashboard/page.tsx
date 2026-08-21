"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IndianRupee,
  FileText,
  Users,
  Wallet,
  Activity,
  ChevronRight,
  ShieldCheck,
  Download,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getModule, type ModuleDef } from "@/lib/modules";
import { InventoryModule } from "@/components/modules/inventory/InventoryModule";
import { StockTransfersModule } from "@/components/modules/stock-transfers/StockTransfersModule";
import { AssetsModule } from "@/components/modules/assets/AssetsModule";
import { ItemsModule } from "@/components/modules/items/ItemsModule";
import { EmployeesModule } from "@/components/modules/employees-module";
import { BusinessProfileModule } from "@/components/modules/business-profile/BusinessProfileModule";
import { BranchesModule } from "@/components/modules/branches/BranchesModule";
import { useAuthStore } from "@/store/authStore";

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
] as const;

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("m") || "dashboard";
  const { user } = useAuthStore();

  const handleNavigate = useCallback(
    (slug: string) => {
      if (slug === "dashboard") {
        router.push("/admin/dashboard");
      } else {
        router.push(`/admin/dashboard?m=${slug}`);
      }
    },
    [router]
  );

  const activeModule = getModule(activeSlug);

  return (
    <AppShell activeSlug={activeSlug} onNavigate={handleNavigate}>
      {activeSlug === "dashboard" || !activeModule ? (
        <AdminDashboardView userEmail={user?.email} />
      ) : activeSlug === "inventory" ? (
        <InventoryModule />
      ) : activeSlug === "stock-transfers" ? (
        <StockTransfersModule />
      ) : activeSlug === "assets" ? (
        <AssetsModule />
      ) : activeSlug === "items" ? (
        <ItemsModule />
      ) : activeSlug === "employees" ? (
        <EmployeesModule />
      ) : activeSlug === "business-profile" ? (
        <BusinessProfileModule />
      ) : activeSlug === "branches" ? (
        <BranchesModule />
      ) : (
        <ModulePreviewView module={activeModule} />
      )}
    </AppShell>
  );
}

function AdminDashboardView({ userEmail }: { userEmail?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin Executive Dashboard"
        description={`Welcome back ${userEmail || 'Admin'} — Full Business Control & System Overview.`}
        icon={ShieldCheck}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="h-8 px-3 gap-1.5 text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role: Super Admin
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export Financials
            </Button>
          </div>
        }
      />

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
              <h3 className="text-sm font-semibold text-foreground">Company Revenue vs Expenses</h3>
              <p className="text-xs text-muted-foreground">Executive Overview · in ₹</p>
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
          <div className="mt-4 h-\[280px\] w-full">
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
              <h3 className="text-sm font-semibold text-foreground">System Audit Log</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View all
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="mt-2 h-\[280px\] pr-2">
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex gap-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
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
    </div>
  );
}

function ModulePreviewView({ module }: { module: ModuleDef }) {
  const Icon = module.icon;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={module.label}
        description={module.description}
        icon={Icon}
      />
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="uppercase">{module.group}</Badge>
            <span className="text-xs text-muted-foreground">REST Route Prefix: <code className="font-mono">{module.prefix}</code></span>
          </div>
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="text-sm font-semibold mb-2">Available API Endpoints:</h4>
            <div className="space-y-2">
              {module.endpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-3 text-xs border-b border-border/40 pb-2 last:border-0">
                  <Badge variant={ep.method === "GET" ? "secondary" : "default"} className="w-16 justify-center">
                    {ep.method}
                  </Badge>
                  <code className="font-mono font-medium">{ep.path}</code>
                  <span className="text-muted-foreground ml-auto">{ep.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
