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
import { MoreHorizontal, Pencil, Trash2, Package, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemRow } from "@/lib/services/item.service";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemsTableProps {
  items: ItemRow[];
  isLoading: boolean;
  onEdit: (item: ItemRow) => void;
  onDelete: (id: number) => void;
}

export function ItemsTable({ items, isLoading, onEdit, onDelete }: ItemsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-16 border rounded-lg bg-slate-50/50">
        <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No Items Found</h3>
        <p className="text-sm text-slate-500 mt-1">Start by adding your first product or service.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[300px]">Item & Category</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Tax (GST)</TableHead>
            <TableHead className="text-right">Available Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="group hover:bg-slate-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.category === 'product' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500 capitalize">
                      {item.category}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="font-mono text-xs text-slate-600">
                {item.sku || "—"}
              </TableCell>
              
              <TableCell className="text-right font-medium text-slate-900">
                ₹{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </TableCell>
              
              <TableCell className="text-right text-sm text-slate-600">
                {item.gstRate ? `${item.gstRate}%` : "—"}
                {item.hsnOrSacCode && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.hsnOrSacCode}</div>
                )}
              </TableCell>
              
              <TableCell className="text-right">
                {item.category === 'service' ? (
                  <span className="text-xs text-slate-400 italic">N/A</span>
                ) : (
                  <Badge variant="outline" className={
                    (item.inventory?.quantity || 0) <= 0 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }>
                    {item.inventory?.quantity || 0} in stock
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
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
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
