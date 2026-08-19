import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InventoryService } from "@/lib/services/inventory.service";
import { toast } from "sonner";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryId: number;
  itemName: string;
  currentStock: number;
  onSuccess: () => void;
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  inventoryId,
  itemName,
  currentStock,
  onSuccess,
}: AdjustStockDialogProps) {
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"add" | "reduce">("add");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delta || delta <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }
    const finalDelta = mode === "add" ? delta : -delta;

    // Prevent stock from going negative
    if (currentStock + finalDelta < 0) {
      toast.error("Adjustment cannot result in negative stock.");
      return;
    }

    try {
      setLoading(true);
      await InventoryService.adjustInventory(inventoryId, finalDelta, reason);
      toast.success("Stock adjusted successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock for {itemName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6 flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="font-semibold">{currentStock}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={mode === "add" ? "default" : "outline"}
                className={`flex-1 ${mode === "add" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={() => setMode("add")}
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Stock In (+ )
              </Button>
              <Button
                type="button"
                variant={mode === "reduce" ? "default" : "outline"}
                className={`flex-1 ${mode === "reduce" ? "bg-rose-600 hover:bg-rose-700" : ""}`}
                onClick={() => setMode("reduce")}
              >
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Stock Out (- )
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>Quantity to {mode === "add" ? "Add" : "Reduce"}</Label>
              <Input
                type="number"
                min={1}
                required
                value={delta || ""}
                onChange={(e) => setDelta(Number(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Reason for Adjustment</Label>
              <Textarea
                placeholder="e.g. Wastage, Manual recount, Found extra..."
                value={reason}
                required
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adjusting..." : "Confirm Adjustment"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
