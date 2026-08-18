import { BusinessProfileModule } from "@/components/modules/business-profile/BusinessProfileModule";

export const metadata = {
  title: "Business Profile Settings",
  description: "Manage your business settings, addresses, and compliance details.",
};

export default function BusinessProfilePage() {
  return (
    <div className="p-6">
      <BusinessProfileModule />
    </div>
  );
}
