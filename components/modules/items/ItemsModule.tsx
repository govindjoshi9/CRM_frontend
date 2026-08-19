"use client";

import React, { useState, useEffect } from "react";
import { Plus, Package, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ItemRow, ItemService } from "@/lib/services/item.service";
import { ItemsTable } from "./components/ItemsTable";
import { ItemFormDialog } from "./components/ItemFormDialog";

export function ItemsModule() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemRow | undefined>(undefined);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await ItemService.getItems(undefined, true);
      setItems(data);
    } catch {
      toast.error("Failed to load items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (item?: ItemRow) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item? This will also remove its inventory records.")) {
      try {
        await ItemService.deleteItem(id);
        toast.success("Item deleted successfully");
        fetchItems();
      } catch {
        toast.error("Failed to delete item");
      }
    }
  };

  const filteredItems = items.filter((it) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      it.name.toLowerCase().includes(q) ||
      it.sku?.toLowerCase().includes(q) ||
      it.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600" />
            Items & Inventory
          </h2>
          <p className="text-sm text-slate-500">
            Manage your products, services, pricing, and stock levels.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="pl-9 h-9"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-slate-600 font-normal">
            Total: {filteredItems.length} items
          </Badge>
          <Button variant="ghost" size="sm" onClick={fetchItems} className="text-indigo-600">
            Refresh
          </Button>
        </div>
      </div>

      <ItemsTable 
        items={filteredItems} 
        isLoading={isLoading} 
        onEdit={handleOpenDialog} 
        onDelete={handleDelete} 
      />

      <ItemFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        item={editingItem} 
        onSuccess={fetchItems} 
      />
    </div>
  );
}
