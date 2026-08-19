import { useEffect, useState, useCallback } from "react";
import { Warehouse, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryRecord, InventoryService } from "@/lib/services/inventory.service";
import { InventoryTable } from "./components/InventoryTable";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export function InventoryModule() {
  const { user } = useAuthStore();
  const [data, setData] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all locations if admin, else branch-specific
      const isSuper = user?.role === "admin";
      const records = await InventoryService.getInventory(undefined, isSuper);
      setData(records);
    } catch (err: any) {
      toast.error("Failed to load inventory records");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filteredData = data.filter((row) => {
    const s = search.toLowerCase();
    const itemName = row.item?.name?.toLowerCase() || "";
    const sku = row.item?.sku?.toLowerCase() || "";
    return itemName.includes(s) || sku.includes(s);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory & Stock"
        description="Monitor warehouse stock levels, adjust stock, and view real-time availability."
        icon={Warehouse}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search by item name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total Records: {filteredData.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInventory}
            disabled={loading}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <InventoryTable data={filteredData} onRefresh={fetchInventory} />
    </div>
  );
}
