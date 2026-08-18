"use client";

import React, { useState, useEffect } from "react";
import { Plus, Store, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchItem, BranchService } from "@/lib/services/branch.service";
import { BranchesTable } from "./components/BranchesTable";
import { BranchFormDialog } from "./components/BranchFormDialog";

export function BranchesModule() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "branch" | "warehouse">("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | undefined>(undefined);

  useEffect(() => {
    fetchBranches();
  }, [activeTab]);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const data = await BranchService.getBranches(activeTab, true);
      setBranches(data);
    } catch (err) {
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (branch?: BranchItem) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("Are you sure you want to deactivate this location?")) {
      try {
        await BranchService.deactivateBranch(id);
        toast.success("Location deactivated");
        fetchBranches();
      } catch (err) {
        toast.error("Failed to deactivate location");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600" />
            Branches & Warehouses
          </h2>
          <p className="text-sm text-slate-500">
            Manage your physical locations, warehouses, and branch-specific settings.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Locations</TabsTrigger>
            <TabsTrigger value="branch">Branches Only</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouses Only</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <BranchesTable 
        branches={branches} 
        isLoading={isLoading} 
        onEdit={handleOpenDialog} 
        onDeactivate={handleDeactivate} 
      />

      <BranchFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        branch={editingBranch} 
        onSuccess={fetchBranches} 
      />
    </div>
  );
}
