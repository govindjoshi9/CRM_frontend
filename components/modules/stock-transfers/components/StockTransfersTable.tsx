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
import { MoreHorizontal, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockTransferRecord, StockTransferService } from "@/lib/services/stock-transfer.service";
import { toast } from "sonner";

interface StockTransfersTableProps {
  data: StockTransferRecord[];
  onRefresh: () => void;
}

export function StockTransfersTable({ data, onRefresh }: StockTransfersTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleComplete = async (id: number) => {
    try {
      setLoadingId(id);
      await StockTransferService.completeTransfer(id);
      toast.success("Transfer marked as completed.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to complete transfer");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setLoadingId(id);
      await StockTransferService.cancelTransfer(id, "Cancelled manually from UI");
      toast.success("Transfer cancelled.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to cancel transfer");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transfer No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No stock transfers found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const itemCount = row.transferItems?.length || 0;
              const totalQty = row.transferItems?.reduce((acc, curr) => acc + Number(curr.quantity), 0) || 0;

              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 text-purple-600">
                        <ArrowRightLeft className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm">{row.transferNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(row.transferDate).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-10">From:</span>
                        <span className="font-medium">{row.sourceBranch?.branchName || `Branch #${row.sourceBranchId}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-10">To:</span>
                        <span className="font-medium">{row.destinationBranch?.branchName || `Branch #${row.destinationBranchId}`}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{itemCount} items</span>
                    <span className="text-xs text-muted-foreground block">({totalQty} total qty)</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        row.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : row.status === "draft"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : row.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    >
                      {row.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleComplete(row.id)}
                          disabled={row.status !== "draft" && row.status !== "in_transit" || loadingId === row.id}
                          className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCancel(row.id)}
                          disabled={row.status === "completed" || row.status === "cancelled" || loadingId === row.id}
                          className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Transfer
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
  );
}
