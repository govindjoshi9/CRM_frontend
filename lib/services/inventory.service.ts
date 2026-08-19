import apiClient from "@/lib/axios";
import { ItemRow } from "./item.service";

export interface InventoryRecord {
  id: number;
  businessId: number;
  branchId: number | null;
  itemId: number;
  quantity: number;
  reservedQty: number;
  onOrderQty: number;
  valuationAvgCost: number;
  minimumThreshold: number;
  lastInAt: string | null;
  lastOutAt: string | null;
  item?: ItemRow;
}

export const InventoryService = {
  /**
   * Get all inventory records (optionally filtered by branchId or allLocations)
   */
  async getInventory(branchId?: number, allLocations?: boolean): Promise<InventoryRecord[]> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append("branchId", String(branchId));
      if (allLocations) params.append("allLocations", "true");
      
      const res = await apiClient.get(`/inventory?${params.toString()}`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Adjust inventory stock (+ or -)
   */
  async adjustInventory(id: number, delta: number, reason: string): Promise<any> {
    const res = await apiClient.post(`/inventory/${id}/adjust`, {
      delta,
      reason
    });
    return res.data;
  }
};
