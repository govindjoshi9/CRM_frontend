"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersHeader } from "./UsersHeader";
import { UsersTable } from "./UsersTable";
import { UserFormDialog } from "./UserFormDialog";
import { EmployeeService, EmployeeItem, Department, Designation } from "@/lib/services/employee.service";

export function UsersModule() {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [empData, deptData, desigData] = await Promise.all([
        EmployeeService.getEmployees(),
        EmployeeService.getDepartments(),
        EmployeeService.getDesignations(),
      ]);

      setEmployees(empData);
      setDepartments(deptData);
      setDesignations(desigData);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to load data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (target: EmployeeItem) => {
    try {
      await EmployeeService.toggleStatus(target.id, target.status);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDeleteUser = async (target: EmployeeItem) => {
    if (!confirm(`Are you sure you want to deactivate ${target.name}?`)) return;
    try {
      await EmployeeService.deleteEmployee(target.id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const filteredEmployees = employees.filter((u) => {
    const matchesSearch = !search.trim() ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
      
    // Apply the status filter
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = u.status === "active";
    } else if (statusFilter === "inactive") {
      matchesStatus = u.status === "inactive" || u.status === "suspended" || u.status === "terminated";
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader
        employees={employees}
        isLoading={isLoading}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onRefresh={fetchData}
        onAddClick={() => setIsAddOpen(true)}
      />

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <UsersTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        onAddClick={() => setIsAddOpen(true)}
      />

      <UserFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        departments={departments}
        designations={designations}
        onSuccess={fetchData}
      />
    </div>
  );
}
