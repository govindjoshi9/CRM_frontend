import {
  UserCog,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeItem } from "@/lib/services/employee.service";

interface EmployeesHeaderProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  search: string;
  statusFilter: string;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onRefresh: () => void;
  onAddClick: () => void;
}

export function EmployeesHeader({
  employees,
  isLoading,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
  onAddClick,
}: UsersHeaderProps) {
  const activeCount = employees.filter((e) => e.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users & Employees"
        description="Manage workspace members, employee profiles, and system access."
        icon={UserCog}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              size="sm"
              onClick={onAddClick}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Members
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {employees.length}
            </p>
          </div>
        </Card>
        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active
            </p>
            <p className="text-2xl font-extrabold text-slate-900">{activeCount}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search members…"
              className="h-10 pl-9 bg-white border-slate-200"
            />
          </div>
          <select
            className="h-10 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            onChange={(e) => onStatusFilterChange(e.target.value)}
            value={statusFilter}
            id="status-filter"
          >
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="all">All Members</option>
          </select>
        </div>
      </div>
    </div>
  );
}
