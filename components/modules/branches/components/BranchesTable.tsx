import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Building, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BranchItem } from "@/lib/services/branch.service";
import { Skeleton } from "@/components/ui/skeleton";

interface BranchesTableProps {
  branches: BranchItem[];
  isLoading: boolean;
  onEdit: (branch: BranchItem) => void;
  onDeactivate: (id: number) => void;
}

export function BranchesTable({ branches, isLoading, onEdit, onDeactivate }: BranchesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-slate-50/50">
        <Store className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No Branches Found</h3>
        <p className="text-sm text-slate-500 mt-1">Get started by creating a new branch or warehouse.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[300px]">Name & Type</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    {branch.isWarehouse ? <Store className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {branch.branchName}
                      {branch.isDefault && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" aria-label="Default" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {branch.isWarehouse ? "Warehouse" : "Branch"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-600">
                {branch.branchCode || "—"}
              </TableCell>
              <TableCell className="text-sm text-slate-600 truncate max-w-[200px]">
                {branch.address || "—"}
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {branch.manager?.name || "Unassigned"}
              </TableCell>
              <TableCell>
                {branch.isActive ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  {/* @ts-expect-error */}
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => onEdit(branch)}>
                      <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                      Edit Details
                    </DropdownMenuItem>
                    {branch.isActive && (
                      <DropdownMenuItem 
                        onClick={() => onDeactivate(branch.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
