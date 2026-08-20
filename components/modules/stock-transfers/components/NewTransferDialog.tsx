import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StockTransferService } from "@/lib/services/stock-transfer.service";
import { BranchService, BranchRecord } from "@/lib/services/branch.service";
import { ItemService, ItemRecord } from "@/lib/services/item.service";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface NewTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewTransferDialog({ open, onOpenChange, onSuccess }: NewTransferDialogProps) {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);

  const [sourceBranchId, setSourceBranchId] = useState("");
  const [destinationBranchId, setDestinationBranchId] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  
  const [transferItems, setTransferItems] = useState<{ itemId: string; quantity: string }[]>([
    { itemId: "", quantity: "1" }
  ]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [fetchedBranches, fetchedItems] = await Promise.all([
        BranchService.getBranches(),
        ItemService.getItems(),
      ]);
      setBranches(fetchedBranches);
      setItems(fetchedItems.filter((i) => i.category !== "service")); // Services cannot be transferred
    } catch {
      toast.error("Failed to load branches or items");
    }
  };

  const addItemRow = () => {
    setTransferItems([...transferItems, { itemId: "", quantity: "1" }]);
  };

  const updateItemRow = (index: number, field: "itemId" | "quantity", value: string) => {
    const newItems = [...transferItems];
    newItems[index][field] = value;
    setTransferItems(newItems);
  };

  const removeItemRow = (index: number) => {
    const newItems = [...transferItems];
    newItems.splice(index, 1);
    setTransferItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceBranchId || !destinationBranchId) {
      toast.error("Source and Destination branches are required.");
      return;
    }
    if (sourceBranchId === destinationBranchId) {
      toast.error("Source and Destination cannot be the same.");
      return;
    }

    const validItems = transferItems.filter((ti) => ti.itemId && Number(ti.quantity) > 0);
    if (validItems.length === 0) {
      toast.error("Please add at least one valid item to transfer.");
      return;
    }

    try {
      setLoading(true);
      await StockTransferService.createTransfer({
        sourceBranchId: Number(sourceBranchId),
        destinationBranchId: Number(destinationBranchId),
        transferDate,
        notes,
        items: validItems.map((ti) => ({ itemId: Number(ti.itemId), quantity: Number(ti.quantity) })),
      });
      toast.success("Stock Transfer created successfully (Draft)!");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setSourceBranchId("");
      setDestinationBranchId("");
      setTransferItems([{ itemId: "", quantity: "1" }]);
      setNotes("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Stock Transfer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Source Branch / Warehouse *</Label>
              <select
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={sourceBranchId}
                onChange={(e) => setSourceBranchId(e.target.value)}
              >
                <option value="" disabled>Select Source</option>
                {branches.filter(b => b.isWarehouse).map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Destination Branch *</Label>
              <select
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={destinationBranchId}
                onChange={(e) => setDestinationBranchId(e.target.value)}
              >
                <option value="" disabled>Select Destination</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Transfer Date</Label>
            <Input
              type="date"
              required
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Items to Transfer</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            {transferItems.map((row, index) => (
              <div key={index} className="flex items-end gap-2 bg-muted/20 p-2 rounded-lg border border-border/50">
                <div className="grid gap-2 flex-1">
                  <Label className="text-xs">Select Item</Label>
                  <select
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={row.itemId}
                    onChange={(e) => updateItemRow(index, "itemId", e.target.value)}
                  >
                    <option value="" disabled>Select Item...</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>{i.name} {i.sku ? `(${i.sku})` : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2 w-[120px]">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={row.quantity}
                    onChange={(e) => updateItemRow(index, "quantity", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => removeItemRow(index)}
                  disabled={transferItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Reason for transfer, driver details, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Transfer (Draft)"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
