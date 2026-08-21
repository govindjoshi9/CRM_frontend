"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeesHeader } from "./EmployeesHeader";
import { EmployeesTable } from "./EmployeesTable";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { EmployeeService, EmployeeItem, Department, Designation } from "@/lib/services/employee.service";

export function EmployeesModule() {
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
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } }, message?: string };
      const msg = errorObj.response?.data?.error || errorObj.message || "Failed to load data";
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
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } } };
      alert(errorObj.response?.data?.error || "Failed to update status");
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
      <EmployeesHeader
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

      <EmployeesTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onAddClick={() => setIsAddOpen(true)}
      />

      <EmployeeFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        departments={departments}
        designations={designations}
        onSuccess={fetchData}
      />
    </div>
  );
}
