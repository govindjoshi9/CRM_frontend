import apiClient from "@/lib/axios";

export interface BusinessItem {
  id: number;
  name: string;
  legalName?: string;
  industry?: string;
  address?: string;
  businessAddress?: string;
  registeredAddress?: string;
  placeOfSupply?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  gstin?: string;
  pan?: string;
  tan?: string;
  cin?: string;
  vatNumber?: string;
  exciseNumber?: string;
  fssaiNumber?: string;
  drugLicenseNumber?: string;
  clinicalEstablishmentNumber?: string;
  pharmacyLicenseNumber?: string;
  nursingHomeRegistrationNumber?: string;
  medicalWasteAuthorizationNumber?: string;
  pollConsentNumber?: string;
  fireNocNumber?: string;
  tradeLicenseNumber?: string;
  shopEstablishmentNumber?: string;
  importExportCode?: string;
  isoNumber?: string;
  nabhNumber?: string;
  nablNumber?: string;
  radiationLicenseNumber?: string;
  ayushRegistrationNumber?: string;
  practiceLicenseNumber?: string;
  licenses?: { type: string; number: string }[];
  updatedAt?: string;
}

export const BusinessService = {
  /**
   * Fetch current user's business profile
   */
  async getMyBusiness(): Promise<BusinessItem | null> {
    try {
      const res = await apiClient.get("/businesses/me");
      return res.data?.business || null;
    } catch {
      return null;
    }
  },

  /**
   * Update current user's business profile
   */
  async updateMyBusiness(payload: Partial<BusinessItem>, logoFile?: File): Promise<{ message?: string; business?: BusinessItem }> {
    const formData = new FormData();
    
    // Append all defined payload fields to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const res = await apiClient.put("/businesses/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return res.data;
  },
  
  /**
   * Export business data
   */
  async exportMyBusiness(): Promise<Blob> {
    const res = await apiClient.get("/businesses/me/export", { responseType: 'blob' });
    return res.data;
  }
};
