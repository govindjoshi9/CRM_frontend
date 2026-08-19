import apiClient from "@/lib/axios";

export interface InventoryItem {
  id: number;
  branchId: number | null;
  locationName?: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  valuationAvgCost: number;
}

export interface ItemRow {
  id: number;
  name: string;
  sku: string;
  category: "product" | "service";
  description?: string | null;
  unitPrice: number;
  buyingPrice?: number | null;
  gstRate: number;
  hsnOrSacCode?: string | null;
  imageUrl?: string | null;
  uomId?: number | null;
  taxSlabId?: number | null;
  isBatchManaged: boolean;
  isExpiryManaged: boolean;
  
  // Flattened field for table convenience
  inventory?: {
    quantity: number;
    reservedQty: number;
  };
}

export const ItemService = {
  /**
   * Get all items. Includes branch-wise inventory automatically via backend shaping.
   */
  async getItems(branchId?: number, allLocations?: boolean): Promise<ItemRow[]> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append("branchId", String(branchId));
      if (allLocations) params.append("allLocations", "true");
      
      const res = await apiClient.get(`/items?${params.toString()}`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new item (product or service)
   */
  async createItem(data: Partial<ItemRow>): Promise<ItemRow> {
    const res = await apiClient.post("/items/create", data);
    return res.data?.item;
  },

  /**
   * Get single item with its stock details for the current branch
   */
  async getItemWithStock(id: number, branchId?: number) {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    const res = await apiClient.get(`/items/${id}/with-stock?${params.toString()}`);
    return res.data;
  },

  /**
   * Lookup an item via barcode/SKU (useful for POS)
   */
  async getItemBySku(sku: string, branchId?: number) {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    const res = await apiClient.get(`/items/barcode/${sku}?${params.toString()}`);
    return res.data;
  },

  /**
   * Update an existing item
   */
  async updateItem(id: number, data: Partial<ItemRow>): Promise<ItemRow> {
    const res = await apiClient.put(`/items/${id}`, data);
    return res.data?.item;
  },

  /**
   * Delete an item (and its inventory)
   */
  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`/items/${id}`);
  }
};
