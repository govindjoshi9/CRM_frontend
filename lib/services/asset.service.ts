import apiClient from "@/lib/axios";

export interface AssetRecord {
  id: number;
  businessId: number;
  assetName: string;
  description: string | null;
  assetType: string;
  purchaseDate: string;
  purchasePrice: number;
  quantity: number;
  status: "Active" | "Sold" | "Scrapped";
  meta: any;
  createdAt: string;
  updatedAt: string;
}

export const AssetService = {
  /**
   * Get all fixed assets
   */
  async getAssets(): Promise<AssetRecord[]> {
    try {
      const res = await apiClient.get("/assets");
      return res.data?.assets || [];
    } catch {
      return [];
    }
  },

  /**
   * Add a new fixed asset manually
   */
  async addAsset(data: Partial<AssetRecord>): Promise<AssetRecord> {
    const res = await apiClient.post("/assets", data);
    return res.data?.asset;
  },

  /**
   * Dispose an asset (Sell or Scrap)
   */
  async disposeAsset(id: number, status: "Sold" | "Scrapped", salePrice?: number): Promise<AssetRecord> {
    const res = await apiClient.put(`/assets/${id}/dispose`, {
      status,
      salePrice,
    });
    return res.data?.asset;
  },
};
