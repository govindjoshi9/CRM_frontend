"use client";

import { useState } from "react";
import {
  FileText,
  CreditCard,
  Building2,
  Download,
  Receipt,
  Clock,
  UserCheck,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const CLIENT_INVOICES = [
  { id: "INV-2024-001", date: "2026-08-01", amount: "₹45,000", status: "Paid", dueDate: "2026-08-15" },
  { id: "INV-2024-042", date: "2026-08-08", amount: "₹28,500", status: "Pending", dueDate: "2026-08-22" },
  { id: "INV-2024-089", date: "2026-08-10", amount: "₹12,200", status: "Pending", dueDate: "2026-08-24" },
];

const CLIENT_RECEIPTS = [
  { id: "RCP-8841", date: "2026-08-02", amount: "₹45,000", mode: "Bank Transfer", reference: "UTR-8849201" },
];

export default function ClientPortalPage() {
  const router = useRouter();
  const { party, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "receipts">("overview");

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Client Topbar Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight block">Client Portal</span>
            <span className="text-[11px] text-muted-foreground">{party?.name || "Customer Account"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-7 px-2.5 text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            Client
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
        <PageHeader
          title={`Welcome, ${party?.name || "Valued Client"}`}
          description="View your active invoices, account balance, payment history, and download statements."
          icon={Building2}
          actions={
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Download Statement
            </Button>
          }
        />

        {/* Client KPI summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Total Outstanding" value="₹40,700" delta={0} icon={CreditCard} tone="amber" hint="2 unpaid invoices" />
          <KpiCard label="Total Paid This Month" value="₹45,000" delta={100} icon={Receipt} tone="emerald" hint="1 payment" />
          <KpiCard label="Active Invoices" value="3" delta={0} icon={FileText} tone="violet" hint="Last invoice Aug 10" />
        </div>

        {/* Client Navigation Tabs */}
        <div className="flex border-b border-border gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 border-b-2 transition-colors ${activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Invoices & Bills
          </button>
          <button
            onClick={() => setActiveTab("receipts")}
            className={`pb-2 border-b-2 transition-colors ${activeTab === "receipts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Payment Receipts
          </button>
        </div>

        {/* Invoices List */}
        {activeTab === "overview" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Your Invoices</h3>
              <Badge variant="outline">{CLIENT_INVOICES.length} Invoices</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CLIENT_INVOICES.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono font-medium">{inv.id}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.dueDate}</TableCell>
                    <TableCell className="font-semibold">{inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "Paid" ? "secondary" : "destructive"}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Receipts List */}
        {activeTab === "receipts" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Payment History & Receipts</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CLIENT_RECEIPTS.map((rcp) => (
                  <TableRow key={rcp.id}>
                    <TableCell className="font-mono font-medium">{rcp.id}</TableCell>
                    <TableCell>{rcp.date}</TableCell>
                    <TableCell>{rcp.mode}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{rcp.reference}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">{rcp.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}
