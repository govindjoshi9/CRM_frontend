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
import { MoreHorizontal, Laptop2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetRecord } from "@/lib/services/asset.service";
import { DisposeAssetDialog } from "./DisposeAssetDialog";

interface AssetsTableProps {
  data: AssetRecord[];
  onRefresh: () => void;
}

export function AssetsTable({ data, onRefresh }: AssetsTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [disposeOpen, setDisposeOpen] = useState(false);

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Purchased On</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No assets found. Add an asset to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600">
                        <Laptop2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {row.assetName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground truncate max-w-[200px]">
                          {row.description || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{row.assetType}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(row.purchaseDate).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">₹{Number(row.purchasePrice).toFixed(2)}</span>
                    {row.quantity > 1 && <span className="text-xs text-muted-foreground block">Qty: {row.quantity}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : row.status === "Sold"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }
                    >
                      {row.status}
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
                          onClick={() => {
                            setSelectedAsset(row);
                            setDisposeOpen(true);
                          }}
                          disabled={row.status !== "Active"}
                        >
                          Dispose (Sell / Scrap)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAsset && (
        <DisposeAssetDialog
          open={disposeOpen}
          onOpenChange={setDisposeOpen}
          assetId={selectedAsset.id}
          assetName={selectedAsset.assetName}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
