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
import { BranchItem, BranchService } from "@/lib/services/branch.service";
import { toast } from "sonner";

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: BranchItem;
  onSuccess: () => void;
}

export function BranchFormDialog({ open, onOpenChange, branch, onSuccess }: BranchFormDialogProps) {
  const isEditing = !!branch;

  const [formData, setFormData] = useState<Partial<BranchItem>>({
    branchName: "",
    branchCode: "",
    address: "",
    gstin: "",
    isDefault: false,
    isActive: true,
    isWarehouse: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (branch) {
        setFormData({
          branchName: branch.branchName || "",
          branchCode: branch.branchCode || "",
          address: branch.address || "",
          gstin: branch.gstin || "",
          isDefault: branch.isDefault || false,
          isActive: branch.isActive !== false,
          isWarehouse: branch.isWarehouse || false,
        });
      } else {
        setFormData({
          branchName: "",
          branchCode: "",
          address: "",
          gstin: "",
          isDefault: false,
          isActive: true,
          isWarehouse: false,
        });
      }
    }
  }, [open, branch]);

  const handleChange = (field: keyof BranchItem, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchName) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && branch.id) {
        await BranchService.updateBranch(branch.id, formData);
        toast.success("Updated successfully");
      } else {
        await BranchService.createBranch(formData);
        toast.success("Created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Details" : "Add New Location"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>Location Name *</Label>
              <Input 
                value={formData.branchName || ""} 
                onChange={(e) => handleChange("branchName", e.target.value)} 
                placeholder="e.g. Head Office, Mumbai Warehouse"
                autoFocus
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input 
                value={formData.branchCode || ""} 
                onChange={(e) => handleChange("branchCode", e.target.value)} 
                placeholder="e.g. HO-01"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>GSTIN</Label>
              <Input 
                value={formData.gstin || ""} 
                onChange={(e) => handleChange("gstin", e.target.value)} 
                placeholder="Optional GST for this branch"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>Address</Label>
              <Input 
                value={formData.address || ""} 
                onChange={(e) => handleChange("address", e.target.value)} 
                placeholder="Full physical address"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Is this a Warehouse?</Label>
                <p className="text-xs text-slate-500">Enable if this location stores physical inventory</p>
              </div>
              <Switch 
                checked={formData.isWarehouse} 
                onCheckedChange={(v) => handleChange("isWarehouse", v)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Set as Default</Label>
                <p className="text-xs text-slate-500">Use this location as default for billing and stock</p>
              </div>
              <Switch 
                checked={formData.isDefault} 
                onCheckedChange={(v) => handleChange("isDefault", v)} 
              />
            </div>

            {isEditing && (
              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <div>
                  <Label className="text-base font-medium">Active Status</Label>
                  <p className="text-xs text-slate-500">Inactive locations are hidden from menus</p>
                </div>
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={(v) => handleChange("isActive", v)} 
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? "Saving..." : "Save Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
