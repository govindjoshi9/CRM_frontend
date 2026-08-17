"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  FileText,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Activity,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getModule, type ModuleDef } from "@/lib/modules";
import { ItemsModule } from "@/components/modules/items-module";
import { UsersModule } from "@/components/modules/users-module";
import { useAuthStore } from "@/store/authStore";

const TASKS = [
  { id: "TSK-101", title: "Follow up with Priya Sharma on CRM quote", status: "Pending", priority: "High" },
  { id: "TSK-102", title: "Verify stock count for Warehouse West", status: "In Progress", priority: "Medium" },
  { id: "TSK-103", title: "Generate monthly payslips for staff", status: "Completed", priority: "Normal" },
  { id: "TSK-104", title: "Process purchase return for Sony India", status: "Pending", priority: "High" },
];

export default function StaffDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("m") || "dashboard";
  const { user } = useAuthStore();

  const handleNavigate = useCallback(
    (slug: string) => {
      if (slug === "dashboard") {
        router.push("/staff/dashboard");
      } else {
        router.push(`/staff/dashboard?m=${slug}`);
      }
    },
    [router]
  );

  const activeModule = getModule(activeSlug);

  return (
    <AppShell activeSlug={activeSlug} onNavigate={handleNavigate}>
      {activeSlug === "dashboard" || !activeModule ? (
        <StaffDashboardView userRole={user?.role} userEmail={user?.email} />
      ) : activeSlug === "items" ? (
        <ItemsModule />
      ) : activeSlug === "users" ? (
        <UsersModule />
      ) : (
        <ModulePreviewView module={activeModule} />
      )}
    </AppShell>
  );
}

function StaffDashboardView({ userRole, userEmail }: { userRole?: string; userEmail?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff Workspace & Operations"
        description={`Logged in as ${userEmail || 'Staff'} (${(userRole || 'Staff').toUpperCase()}) — Daily tasks, inventory, and operations.`}
        icon={Briefcase}
        actions={
          <Badge variant="outline" className="h-8 px-3 gap-1.5 text-xs border-blue-500/30 bg-blue-500/10 text-blue-600">
            <Briefcase className="h-3.5 w-3.5" />
            Role: {(userRole || 'Staff').toUpperCase()}
          </Badge>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="My Open Tasks" value="4" delta={0} icon={CheckCircle2} tone="violet" hint="2 High priority" />
        <KpiCard label="Items in Stock" value="1,420" delta={5.2} icon={Package} tone="emerald" hint="12 categories" />
        <KpiCard label="Invoices Created Today" value="18" delta={12.0} icon={FileText} tone="amber" hint="Total ₹1.45L" />
        <KpiCard label="Active Leads" value="14" delta={2.1} icon={Users} tone="rose" hint="Assigned to me" />
      </div>

      {/* Tasks & Operations */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Operational Action Items</h3>
              <p className="text-xs text-muted-foreground">Tasks assigned to your department</p>
            </div>
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New Task
            </Button>
          </div>
          <div className="space-y-2">
            {TASKS.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <span className="text-xs text-muted-foreground">{t.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.priority === "High" ? "destructive" : "secondary"}>
                    {t.priority}
                  </Badge>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Quick Shortcuts</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2 h-10 text-sm">
              <Package className="h-4 w-4 text-emerald-500" />
              Manage Inventory Items
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-10 text-sm">
              <FileText className="h-4 w-4 text-blue-500" />
              Create Sales Invoice
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-10 text-sm">
              <Users className="h-4 w-4 text-violet-500" />
              Capture New Lead
            </Button>
          </div>
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
            <h4 className="text-sm font-semibold mb-2">Available Endpoints:</h4>
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
