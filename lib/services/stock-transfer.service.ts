import apiClient from "@/lib/axios";

export interface StockTransferItemRecord {
  id: number;
  itemId: number;
  quantity: number;
  item?: {
    id: number;
    name: string;
    sku: string;
  };
}

export interface StockTransferRecord {
  id: number;
  tenantId: number;
  transferNumber: string;
  sourceBranchId: number;
  destinationBranchId: number;
  transferDate: string;
  status: "draft" | "in_transit" | "completed" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sourceBranch?: {
    id: number;
    branchName: string;
  };
  destinationBranch?: {
    id: number;
    branchName: string;
  };
  transferItems: StockTransferItemRecord[];
}

export const StockTransferService = {
  /**
   * Get all stock transfers
   */
  async getTransfers(): Promise<StockTransferRecord[]> {
    try {
      const res = await apiClient.get("/stock-transfers");
      return res.data?.transfers || [];
    } catch {
      return [];
    }
  },

  /**
   * Get a specific stock transfer
   */
  async getTransferById(id: number): Promise<StockTransferRecord> {
    const res = await apiClient.get(`/stock-transfers/${id}`);
    return res.data?.transfer;
  },

  /**
   * Create a new stock transfer (Draft)
   */
  async createTransfer(data: {
    sourceBranchId: number;
    destinationBranchId: number;
    transferDate?: string;
    notes?: string;
    items: { itemId: number; quantity: number }[];
  }): Promise<StockTransferRecord> {
    const res = await apiClient.post("/stock-transfers", data);
    return res.data?.transfer;
  },

  /**
   * Complete a stock transfer (Updates actual stock)
   */
  async completeTransfer(id: number): Promise<void> {
    await apiClient.put(`/stock-transfers/${id}/complete`);
  },

  /**
   * Cancel a stock transfer
   */
  async cancelTransfer(id: number, reason?: string): Promise<void> {
    await apiClient.put(`/stock-transfers/${id}/cancel`, { notes: reason });
  },
};
