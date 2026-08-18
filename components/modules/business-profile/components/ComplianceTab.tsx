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

interface ComplianceTabProps {
  business: Partial<BusinessItem>;
  handleChange: (field: keyof BusinessItem, value: string) => void;
}

export function ComplianceTab({ business, handleChange }: ComplianceTabProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Compliance & Licenses</CardTitle>
        <CardDescription>Industry specific licenses and compliance numbers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>FSSAI Number</Label>
            <Input 
              value={business.fssaiNumber || ""} 
              onChange={(e) => handleChange("fssaiNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Drug License Number</Label>
            <Input 
              value={business.drugLicenseNumber || ""} 
              onChange={(e) => handleChange("drugLicenseNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Shop & Establishment No.</Label>
            <Input 
              value={business.shopEstablishmentNumber || ""} 
              onChange={(e) => handleChange("shopEstablishmentNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Trade License</Label>
            <Input 
              value={business.tradeLicenseNumber || ""} 
              onChange={(e) => handleChange("tradeLicenseNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>ISO Number</Label>
            <Input 
              value={business.isoNumber || ""} 
              onChange={(e) => handleChange("isoNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Import/Export Code</Label>
            <Input 
              value={business.importExportCode || ""} 
              onChange={(e) => handleChange("importExportCode", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fire NOC Number</Label>
            <Input 
              value={business.fireNocNumber || ""} 
              onChange={(e) => handleChange("fireNocNumber", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Pollution Consent No.</Label>
            <Input 
              value={business.pollConsentNumber || ""} 
              onChange={(e) => handleChange("pollConsentNumber", e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
