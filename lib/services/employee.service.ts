import apiClient from "@/lib/axios";

export interface EmployeeItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended" | "terminated";
  createdAt: string;
  department?: { id: number; name: string };
  designation?: { id: number; name: string };
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Designation {
  id: number;
  name: string;
  description?: string;
}

export const EmployeeService = {
  async getEmployees(): Promise<EmployeeItem[]> {
    const res = await apiClient.get("/employees");
    if (res.data?.rows) {
      return res.data.rows;
    } else if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async getDepartments(): Promise<Department[]> {
    try {
      const res = await apiClient.get("/departments");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch {
      return [];
    }
  },

  async getDesignations(): Promise<Designation[]> {
    try {
      const res = await apiClient.get("/designations");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch {
      return [];
    }
  },

  async createDepartment(payload: { name: string; description?: string; businessId?: number }): Promise<Department> {
    const res = await apiClient.post("/departments", payload);
    return res.data;
  },

  async createDesignation(payload: { name: string; description?: string; businessId?: number }): Promise<Designation> {
    const res = await apiClient.post("/designations", payload);
    return res.data;
  },

  async createEmployee(payload: Record<string, unknown>): Promise<{ message?: string; login?: { tempPassword?: string; note?: string } }> {
    const formattedPayload = {
      ...payload,
      departmentId: Number(payload.departmentId),
      designationId: Number(payload.designationId),
      basicSalary: Number(payload.basicSalary),
    };
    const res = await apiClient.post("/employees", formattedPayload);
    return res.data;
  },

  async toggleStatus(employeeId: number, currentStatus: string): Promise<void> {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    await apiClient.put(`/employees/${employeeId}`, { status: nextStatus });
  },

  async deleteEmployee(employeeId: number): Promise<void> {
    await apiClient.delete(`/employees/${employeeId}`);
  }
};

