import React from "react";
import { Building2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BusinessItem } from "@/lib/services/business.service";

interface GeneralInfoTabProps {
  business: Partial<BusinessItem>;
  handleChange: (field: keyof BusinessItem, value: string) => void;
  logoPreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GeneralInfoTab({ business, handleChange, logoPreview, handleFileChange }: GeneralInfoTabProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Basic details about your business and organization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-900">Company Logo</h4>
            <p className="text-xs text-slate-500">Upload a logo to display on invoices and reports. Max 2MB.</p>
            <Button variant="outline" size="sm" className="w-fit mt-2 relative overflow-hidden">
              <Upload className="w-3 h-3 mr-2" />
              Upload File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Business Name</Label>
            <Input 
              value={business.name || ""} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="Enter business name" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Legal Name</Label>
            <Input 
              value={business.legalName || ""} 
              onChange={(e) => handleChange("legalName", e.target.value)} 
              placeholder="Official legal entity name" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Industry / Category</Label>
            <Input 
              value={business.industry || ""} 
              onChange={(e) => handleChange("industry", e.target.value)} 
              placeholder="e.g. Retail, Manufacturing, IT Services" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input 
              value={business.phone || ""} 
              onChange={(e) => handleChange("phone", e.target.value)} 
              placeholder="Primary contact number" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input 
              value={business.website || ""} 
              onChange={(e) => handleChange("website", e.target.value)} 
              placeholder="https://www.example.com" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
