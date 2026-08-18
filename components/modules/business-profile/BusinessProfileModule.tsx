"use client";

import { useState, useEffect } from "react";
import { Save, MapPin, Receipt, ShieldCheck, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessService, BusinessItem } from "@/lib/services/business.service";
import { Skeleton } from "@/components/ui/skeleton";

// Subcomponents
import { GeneralInfoTab } from "./components/GeneralInfoTab";
import { AddressTab } from "./components/AddressTab";
import { TaxDetailsTab } from "./components/TaxDetailsTab";
import { ComplianceTab } from "./components/ComplianceTab";

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
          <GeneralInfoTab 
            business={business} 
            handleChange={handleChange} 
            logoPreview={logoPreview} 
            handleFileChange={handleFileChange} 
          />
        </TabsContent>

        <TabsContent value="address">
          <AddressTab 
            business={business} 
            handleChange={handleChange} 
          />
        </TabsContent>

        <TabsContent value="tax">
          <TaxDetailsTab 
            business={business} 
            handleChange={handleChange} 
          />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceTab 
            business={business} 
            handleChange={handleChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
