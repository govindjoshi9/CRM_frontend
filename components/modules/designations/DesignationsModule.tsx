import { useState, useEffect } from "react";
import { UserCog, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeService, Designation } from "@/lib/services/employee.service";
import { DesignationFormDialog } from "./DesignationFormDialog";

export function DesignationsModule() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      const data = await EmployeeService.getDesignations();
      setDesignations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-indigo-600" />
            Designations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage job titles and roles
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Designation
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
                <TableCell colSpan={2} className="text-center py-8 text-slate-500">Loading designations...</TableCell>
              </TableRow>
            ) : designations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-slate-500">No designations found.</TableCell>
              </TableRow>
            ) : (
              designations.map((desig) => (
                <TableRow key={desig.id} className="hover:bg-slate-50/75">
                  <TableCell className="font-medium text-slate-900">{desig.name}</TableCell>
                  <TableCell className="text-slate-500">{desig.description || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <DesignationFormDialog 
        isOpen={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onSuccess={fetchDesignations} 
      />
    </div>
  );
}

