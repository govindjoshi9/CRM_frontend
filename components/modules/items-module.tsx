"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { api, API_BASE_URL } from "@/lib/api";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemRow {
  id: number;
  name: string;
  sku: string;
  category?: string;
  unit?: string;
  salePrice?: number;
  hsnCode?: string;
  taxRate?: number;
}

/**
 * Demo Items module page.
 *
 * Pattern:
 *  - useQuery from @tanstack/react-query for caching + refetch
 *  - api.get<T>("/api/items") injects the JWT Bearer header automatically
 *  - Loading skeleton, error state, empty state all handled
 *
 * Replace the mock branch with the real `api.get("/api/items")` call once
 * your backend is reachable (set NEXT_PUBLIC_API_BASE_URL).
 */
export function ItemsModule() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery<ItemRow[]>({
    queryKey: ["items"],
    queryFn: async () => {
      try {
        return await api.get<ItemRow[]>("/api/items");
      } catch (e) {
        // Backend not reachable in this preview — fall back to demo data
        if (e instanceof Error && e.message.includes("Failed to fetch")) {
          return MOCK_ITEMS;
        }
        throw e;
      }
    },
    retry: false,
  });

  const filtered = (data || []).filter((it) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      it.name.toLowerCase().includes(q) ||
      it.sku?.toLowerCase().includes(q) ||
      it.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Items & Services"
        description="Manage products, services, SKUs, pricing, and HSN codes."
        icon={Package}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowUpDown className="h-4 w-4" />
              Import
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Item
            </Button>
          </>
        }
      />

      <DemoNotice />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category…"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {filtered.length} items
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7 text-xs">
            Refresh
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to load items"}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((it) => (
                <TableRow key={it.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">#{it.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{it.name}</TableCell>
                  <TableCell className="font-mono text-xs">{it.sku}</TableCell>
                  <TableCell>
                    {it.category ? (
                      <Badge variant="secondary" className="text-xs">{it.category}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {it.salePrice ? `₹${it.salePrice.toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{it.hsnCode || "—"}</TableCell>
                  <TableCell className="text-right text-xs">{it.taxRate ? `${it.taxRate}%` : "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Backend endpoint:{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
          GET {API_BASE_URL}/api/items
        </code>{" "}
        — JWT Bearer auth required.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 flex-1 max-w-[200px]" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Couldn&apos;t load items</p>
        <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
        <Loader2 className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Package className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No items yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create your first item to start invoicing.
        </p>
      </div>
      <Button size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        New Item
      </Button>
    </div>
  );
}

function DemoNotice() {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 text-xs">
      <span className="font-medium text-emerald-700 dark:text-emerald-400">Sample module:</span>{" "}
      <span className="text-muted-foreground">
        This Items page demonstrates the recommended pattern for module pages — TanStack Query for data,
        skeleton/error/empty states, table with row actions. Click sidebar entries for other modules to see
        their API spec. Replace mock data by connecting your backend URL.
      </span>
    </div>
  );
}

const MOCK_ITEMS: ItemRow[] = [
  { id: 1, name: "Widget XL — Premium", sku: "WID-XL-001", category: "Widgets", unit: "pcs", salePrice: 1499, hsnCode: "8473", taxRate: 18 },
  { id: 2, name: "Gadget Pro 2.0", sku: "GAD-PRO-002", category: "Gadgets", unit: "pcs", salePrice: 3299, hsnCode: "8543", taxRate: 18 },
  { id: 3, name: "Service — Installation", sku: "SVC-INST-001", category: "Services", unit: "hr", salePrice: 850, hsnCode: "9987", taxRate: 18 },
  { id: 4, name: "Cable USB-C 2m", sku: "CBL-USBC-2M", category: "Accessories", unit: "pcs", salePrice: 499, hsnCode: "8544", taxRate: 18 },
  { id: 5, name: "Power Adapter 65W", sku: "PWR-65W-001", category: "Accessories", unit: "pcs", salePrice: 1899, hsnCode: "8504", taxRate: 18 },
  { id: 6, name: "Software License — Annual", sku: "SOF-LIC-ANN", category: "Software", unit: "yr", salePrice: 12999, hsnCode: "9983", taxRate: 18 },
  { id: 7, name: "Support Plan — Gold", sku: "SUP-GOLD-001", category: "Services", unit: "yr", salePrice: 24999, hsnCode: "9983", taxRate: 18 },
  { id: 8, name: "Widget Mini", sku: "WID-MN-001", category: "Widgets", unit: "pcs", salePrice: 699, hsnCode: "8473", taxRate: 12 },
];
