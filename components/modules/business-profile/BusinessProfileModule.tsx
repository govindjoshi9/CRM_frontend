"use client";

import { useState, useEffect } from "react";
import { Building2, Save, Upload, MapPin, Receipt, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BusinessService, BusinessItem } from "@/lib/services/business.service";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessProfileModule() {
  const [business, setBusiness] = useState<Partial<BusinessItem>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    setIsLoading(true);
    const data = await BusinessService.getMyBusiness();
    if (data) {
      setBusiness(data);
      if (data.logoUrl) {
        setLogoPreview(data.logoUrl);
      }
    } else {
      toast.error("Failed to load business profile.");
    }
    setIsLoading(false);
  };

  const handleChange = (field: keyof BusinessItem, value: string) => {
    setBusiness((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await BusinessService.updateMyBusiness(business, logoFile || undefined);
      if (res.business) {
        toast.success("Business profile updated successfully");
        setBusiness(res.business);
        if (res.business.logoUrl) {
          setLogoPreview(res.business.logoUrl);
        }
      }
    } catch (err) {
      toast.error("Failed to update business profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Business Profile</h2>
          <p className="text-sm text-slate-500">Manage your business settings, addresses, and compliance details.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-100 p-1 rounded-lg mb-6">
          <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 mr-2" />
            General Info
          </TabsTrigger>
          <TabsTrigger value="address" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="tax" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Receipt className="w-4 h-4 mr-2" />
            Tax Details
          </TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Compliance & Licenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
        </TabsContent>

        <TabsContent value="address">
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
        </TabsContent>

        <TabsContent value="tax">
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
        </TabsContent>

        <TabsContent value="compliance">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
