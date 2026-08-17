import {
  Shield,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { EmployeeItem } from "@/lib/services/employee.service";

interface UsersTableProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  onToggleStatus: (employee: EmployeeItem) => void;
  onAddClick: () => void;
}

export function UsersTable({
  employees,
  isLoading,
  onToggleStatus,
  onAddClick,
}: UsersTableProps) {
  const { user: currentUser } = useAuthStore();

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-slate-200 shadow-sm bg-white p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card className="overflow-hidden border-slate-200 shadow-sm bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">No members found</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Get started by adding team members.
        </p>
        <Button
          size="sm"
          onClick={onAddClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add Member
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-slate-100">
          <TableRow>
            <TableHead className="w-[280px] font-semibold text-slate-700">
              User Profile
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Role / Dept
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700 w-[80px]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((u) => {
            const isSelf = currentUser?.email === u.email;
            return (
              <TableRow key={u.id} className="hover:bg-slate-50/75 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name ? u.name.charAt(0).toUpperCase() : u.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                        {u.name || "—"}
                        {isSelf && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4 bg-indigo-50 text-indigo-600 font-medium"
                          >
                            You
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-slate-500">
                        {u.email} • {u.phone}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-800">
                      {u.designation?.name || "No Designation"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {u.department?.name || "No Department"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize font-medium gap-1.5 ${
                      u.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {u.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 outline-none cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!isSelf && (
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(u)}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
