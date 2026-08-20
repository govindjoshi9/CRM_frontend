import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssetService } from "@/lib/services/asset.service";
import { toast } from "sonner";
import { Store, Trash2 } from "lucide-react";

interface DisposeAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: number;
  assetName: string;
  onSuccess: () => void;
}

export function DisposeAssetDialog({
  open,
  onOpenChange,
  assetId,
  assetName,
  onSuccess,
}: DisposeAssetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"Sold" | "Scrapped">("Sold");
  const [salePrice, setSalePrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await AssetService.disposeAsset(assetId, status, status === "Sold" ? Number(salePrice) : undefined);
      toast.success(`Asset marked as ${status}!`);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to dispose asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dispose Asset: {assetName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={status === "Sold" ? "default" : "outline"}
                className={`flex-1 ${status === "Sold" ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                onClick={() => setStatus("Sold")}
              >
                <Store className="mr-2 h-4 w-4" />
                Sell Asset
              </Button>
              <Button
                type="button"
                variant={status === "Scrapped" ? "default" : "outline"}
                className={`flex-1 ${status === "Scrapped" ? "bg-rose-600 hover:bg-rose-700" : ""}`}
                onClick={() => setStatus("Scrapped")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Scrap Asset
              </Button>
            </div>

            {status === "Sold" && (
              <div className="grid gap-2 animate-in fade-in zoom-in duration-200">
                <Label>Sale Price (₹) *</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  placeholder="e.g. 15000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : `Confirm ${status}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
