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
import { Textarea } from "@/components/ui/textarea";
import { AssetService } from "@/lib/services/asset.service";
import { toast } from "sonner";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AssetFormDialog({ open, onOpenChange, onSuccess }: AssetFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetName: "",
    description: "",
    assetType: "Fixed",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchasePrice: "",
    quantity: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetName || !formData.purchasePrice) {
      toast.error("Asset Name and Purchase Price are required.");
      return;
    }

    try {
      setLoading(true);
      await AssetService.addAsset({
        ...formData,
        purchasePrice: Number(formData.purchasePrice),
        quantity: Number(formData.quantity),
      });
      toast.success("Asset added successfully!");
      onSuccess();
      onOpenChange(false);
      setFormData({
        assetName: "",
        description: "",
        assetType: "Fixed",
        purchaseDate: new Date().toISOString().split("T")[0],
        purchasePrice: "",
        quantity: "1",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Fixed Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label>Asset Name *</Label>
            <Input
              required
              placeholder="e.g. Dell XPS 15 Laptop"
              value={formData.assetName}
              onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Input
                placeholder="e.g. IT Equipment"
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Purchase Date</Label>
              <Input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Purchase Price (Total) *</Label>
              <Input
                type="number"
                required
                min={0}
                step="0.01"
                placeholder="₹ 0.00"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description / Notes</Label>
            <Textarea
              placeholder="Serial numbers, warranty info..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
