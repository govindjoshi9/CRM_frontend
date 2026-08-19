import { useState } from "react";
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
import { MoreHorizontal, Box, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryRecord } from "@/lib/services/inventory.service";
import { AdjustStockDialog } from "./AdjustStockDialog";

interface InventoryTableProps {
  data: InventoryRecord[];
  onRefresh: () => void;
}

export function InventoryTable({ data, onRefresh }: InventoryTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item & SKU</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Available Stock</TableHead>
              <TableHead>Reserved</TableHead>
              <TableHead>On Order</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No inventory records found. Add items first.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const available = Math.max(0, row.quantity - row.reservedQty);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                          <Box className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {row.item?.name || `Item #${row.itemId}`}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            SKU: {row.item?.sku || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{row.branchId ? `Branch #${row.branchId}` : "Central (Main)"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`bg-opacity-20 ${
                          available > 0
                            ? "bg-emerald-500 text-emerald-600 hover:bg-emerald-500/30"
                            : "bg-rose-500 text-rose-600 hover:bg-rose-500/30"
                        }`}
                      >
                        {available} in stock
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{row.reservedQty}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{row.onOrderQty}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRecord(row);
                              setAdjustOpen(true);
                            }}
                          >
                            Adjust Stock (+ / -)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRecord && (
        <AdjustStockDialog
          open={adjustOpen}
          onOpenChange={setAdjustOpen}
          inventoryId={selectedRecord.id}
          itemName={selectedRecord.item?.name || `Item #${selectedRecord.itemId}`}
          currentStock={selectedRecord.quantity}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
