import { useEffect, useState, useCallback } from "react";
import { ArrowRightLeft, Plus, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockTransferRecord, StockTransferService } from "@/lib/services/stock-transfer.service";
import { StockTransfersTable } from "./components/StockTransfersTable";
import { NewTransferDialog } from "./components/NewTransferDialog";
import { toast } from "sonner";

export function StockTransfersModule() {
  const [data, setData] = useState<StockTransferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      const records = await StockTransferService.getTransfers();
      setData(records);
    } catch (err: any) {
      toast.error("Failed to load stock transfers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const filteredData = data.filter((row) => {
    const s = search.toLowerCase();
    return (
      row.transferNumber.toLowerCase().includes(s) ||
      (row.sourceBranch?.branchName || "").toLowerCase().includes(s) ||
      (row.destinationBranch?.branchName || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock Transfers"
        description="Transfer inventory between branches and warehouses."
        icon={ArrowRightLeft}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search by transfer no or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransfers}
            disabled={loading}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>
      </div>

      <StockTransfersTable data={filteredData} onRefresh={fetchTransfers} />

      <NewTransferDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={fetchTransfers}
      />
    </div>
  );
}
