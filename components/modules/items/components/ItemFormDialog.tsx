import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemRow, ItemService } from "@/lib/services/item.service";
import { toast } from "sonner";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ItemRow;
  onSuccess: () => void;
}

export function ItemFormDialog({ open, onOpenChange, item, onSuccess }: ItemFormDialogProps) {
  const isEditing = !!item;

  const [formData, setFormData] = useState<Partial<ItemRow>>({
    name: "",
    sku: "",
    category: "product",
    description: "",
    unitPrice: 0,
    buyingPrice: 0,
    gstRate: 0,
    hsnOrSacCode: "",
    isBatchManaged: false,
    isExpiryManaged: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          name: item.name || "",
          sku: item.sku || "",
          category: item.category || "product",
          description: item.description || "",
          unitPrice: item.unitPrice || 0,
          buyingPrice: item.buyingPrice || 0,
          gstRate: item.gstRate || 0,
          hsnOrSacCode: item.hsnOrSacCode || "",
          isBatchManaged: item.isBatchManaged || false,
          isExpiryManaged: item.isExpiryManaged || false,
        });
      } else {
        setFormData({
          name: "",
          sku: "",
          category: "product",
          description: "",
          unitPrice: 0,
          buyingPrice: 0,
          gstRate: 0,
          hsnOrSacCode: "",
          isBatchManaged: false,
          isExpiryManaged: false,
        });
      }
    }
  }, [open, item]);

  const handleChange = (field: keyof ItemRow, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Item Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && item.id) {
        await ItemService.updateItem(item.id, formData);
        toast.success("Item updated successfully");
      } else {
        await ItemService.createItem(formData);
        toast.success("Item created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "An error occurred while saving item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item / Service" : "Add New Item / Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>Item Name *</Label>
              <Input 
                value={formData.name || ""} 
                onChange={(e) => handleChange("name", e.target.value)} 
                placeholder="e.g. Premium Widget"
                autoFocus
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => handleChange("category", v)}
                disabled={isEditing} // usually you can't change product to service after creation
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product (Tracks Inventory)</SelectItem>
                  <SelectItem value="service">Service (No Inventory)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>SKU / Barcode</Label>
              <Input 
                value={formData.sku || ""} 
                onChange={(e) => handleChange("sku", e.target.value)} 
                placeholder="Leave blank to auto-generate"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>HSN / SAC Code</Label>
              <Input 
                value={formData.hsnOrSacCode || ""} 
                onChange={(e) => handleChange("hsnOrSacCode", e.target.value)} 
                placeholder="Taxation code"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>Sale Price</Label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice || ""} 
                onChange={(e) => handleChange("unitPrice", parseFloat(e.target.value) || 0)} 
              />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>Purchase / Buying Price</Label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                value={formData.buyingPrice || ""} 
                onChange={(e) => handleChange("buyingPrice", parseFloat(e.target.value) || 0)} 
              />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label>GST Rate (%)</Label>
              <Input 
                type="number"
                step="0.1"
                min="0"
                value={formData.gstRate || ""} 
                onChange={(e) => handleChange("gstRate", parseFloat(e.target.value) || 0)} 
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => handleChange("description", e.target.value)} 
                placeholder="Internal notes or customer-facing description..."
                rows={3}
              />
            </div>
          </div>

          {formData.category === "product" && (
            <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 border-b pb-2">Inventory Management Features</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Batch Tracking</Label>
                  <p className="text-xs text-slate-500">Track multiple batches of this product</p>
                </div>
                <Switch 
                  checked={formData.isBatchManaged} 
                  onCheckedChange={(v) => handleChange("isBatchManaged", v)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Expiry Management</Label>
                  <p className="text-xs text-slate-500">Require expiry dates during stock inward</p>
                </div>
                <Switch 
                  checked={formData.isExpiryManaged} 
                  onCheckedChange={(v) => handleChange("isExpiryManaged", v)} 
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
