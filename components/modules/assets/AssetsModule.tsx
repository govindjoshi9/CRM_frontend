import { useEffect, useState, useCallback } from "react";
import { MonitorPlay, Plus, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetRecord, AssetService } from "@/lib/services/asset.service";
import { AssetsTable } from "./components/AssetsTable";
import { AssetFormDialog } from "./components/AssetFormDialog";
import { toast } from "sonner";

export function AssetsModule() {
  const [data, setData] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const records = await AssetService.getAssets();
      setData(records);
    } catch (err: any) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredData = data.filter((row) => {
    const s = search.toLowerCase();
    return row.assetName.toLowerCase().includes(s) || (row.description && row.description.toLowerCase().includes(s));
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fixed Assets"
        description="Manage company equipment, electronics, and fixed property."
        icon={MonitorPlay}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search by asset name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAssets}
            disabled={loading}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
      </div>

      <AssetsTable data={filteredData} onRefresh={fetchAssets} />

      <AssetFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={fetchAssets}
      />
    </div>
  );
}
