import apiClient from "@/lib/axios";

export interface BranchItem {
  id: number;
  tenantId: number;
  branchName: string;
  branchCode: string | null;
  address: string | null;
  gstin: string | null;
  isDefault: boolean;
  isActive: boolean;
  isWarehouse: boolean;
  managerId: number | null;
  manager?: {
    id: number;
    name: string;
    email: string;
    designationId: number | null;
    departmentId: number | null;
  };
  createdAt: string;
  updatedAt: string;
}

export const BranchService = {
  /**
   * Get all branches (optionally filtered by type)
   */
  async getBranches(type: "all" | "branch" | "warehouse" = "all", includeInactive: boolean = false): Promise<BranchItem[]> {
    try {
      const res = await apiClient.get(`/branches?type=${type}&includeInactive=${includeInactive}`);
      return res.data?.branches || [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new branch or warehouse
   */
  async createBranch(data: Partial<BranchItem>): Promise<BranchItem> {
    const res = await apiClient.post("/branches", data);
    return res.data?.branch;
  },

  /**
   * Update an existing branch or warehouse
   */
  async updateBranch(id: number, data: Partial<BranchItem>): Promise<BranchItem> {
    const res = await apiClient.put(`/branches/${id}`, data);
    return res.data?.branch;
  },

  /**
   * Assign a manager to a branch
   */
  async assignManager(id: number, managerId: number | null): Promise<BranchItem> {
    const res = await apiClient.put(`/branches/${id}/manager`, { managerId });
    return res.data?.branch;
  },

  /**
   * Deactivate a branch or warehouse
   */
  async deactivateBranch(id: number): Promise<void> {
    await apiClient.delete(`/branches/${id}`);
  }
};
