import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessItem } from "@/lib/services/business.service";

interface AddressTabProps {
  business: Partial<BusinessItem>;
  handleChange: (field: keyof BusinessItem, value: string) => void;
}

export function AddressTab({ business, handleChange }: AddressTabProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Business Addresses</CardTitle>
        <CardDescription>Configure primary operating and registered addresses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Primary / Operating Address</Label>
            <Textarea 
              value={business.address || ""} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="Main operating address" 
              className="h-24 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Registered Address</Label>
            <Textarea 
              value={business.registeredAddress || ""} 
              onChange={(e) => handleChange("registeredAddress", e.target.value)} 
              placeholder="Address registered with authorities" 
              className="h-24 resize-none"
            />
          </div>
        </div>
        <div className="space-y-1.5 max-w-md">
          <Label>Place of Supply (State Code)</Label>
          <Input 
            value={business.placeOfSupply || ""} 
            onChange={(e) => handleChange("placeOfSupply", e.target.value)} 
            placeholder="e.g. 27 (for Maharashtra)" 
          />
          <p className="text-[11px] text-slate-500">Used for GST calculation (IGST vs CGST/SGST).</p>
        </div>
      </CardContent>
    </Card>
  );
}
