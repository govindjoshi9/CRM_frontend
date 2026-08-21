import { useState, useEffect } from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeService, Department } from "@/lib/services/employee.service";
import { DepartmentFormDialog } from "./DepartmentFormDialog";

export function DepartmentsModule() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await EmployeeService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Departments
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization departments
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-slate-500">Loading departments...</TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-slate-500">No departments found.</TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id} className="hover:bg-slate-50/75">
                  <TableCell className="font-medium text-slate-900">{dept.name}</TableCell>
                  <TableCell className="text-slate-500">{dept.description || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <DepartmentFormDialog 
        isOpen={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onSuccess={fetchDepartments} 
      />
    </div>
  );
}

