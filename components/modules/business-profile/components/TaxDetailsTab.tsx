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
import { BusinessItem } from "@/lib/services/business.service";

interface TaxDetailsTabProps {
  business: Partial<BusinessItem>;
  handleChange: (field: keyof BusinessItem, value: string) => void;
}

export function TaxDetailsTab({ business, handleChange }: TaxDetailsTabProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Tax & Registration Details</CardTitle>
        <CardDescription>Identifiers required for taxation and official billing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>GSTIN</Label>
            <Input 
              value={business.gstin || ""} 
              onChange={(e) => handleChange("gstin", e.target.value)} 
              placeholder="15-digit GST number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>PAN</Label>
            <Input 
              value={business.pan || ""} 
              onChange={(e) => handleChange("pan", e.target.value)} 
              placeholder="Permanent Account Number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>TAN</Label>
            <Input 
              value={business.tan || ""} 
              onChange={(e) => handleChange("tan", e.target.value)} 
              placeholder="Tax Deduction Account Number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>CIN</Label>
            <Input 
              value={business.cin || ""} 
              onChange={(e) => handleChange("cin", e.target.value)} 
              placeholder="Corporate Identification Number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>VAT Number</Label>
            <Input 
              value={business.vatNumber || ""} 
              onChange={(e) => handleChange("vatNumber", e.target.value)} 
              placeholder="VAT / TIN Number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Excise Number</Label>
            <Input 
              value={business.exciseNumber || ""} 
              onChange={(e) => handleChange("exciseNumber", e.target.value)} 
              placeholder="Central Excise Registration" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
