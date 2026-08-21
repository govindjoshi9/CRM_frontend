import { useState } from "react";
import { UserCog, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeeService } from "@/lib/services/employee.service";
import { useAuthStore } from "@/store/authStore";

interface DesignationFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DesignationFormDialog({ isOpen, onOpenChange, onSuccess }: DesignationFormDialogProps) {
  const { token } = useAuthStore();
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    let businessId: number;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      businessId = payload.businessId;
      if (!businessId) throw new Error("Business ID not in token");
    } catch (err) {
      setError("Failed to extract Business ID from token.");
      return;
    }
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await EmployeeService.createDesignation({ ...addForm, businessId });
      setSuccess("Designation created successfully!");
      setAddForm({ name: "", description: "" });
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create designation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-600" />
            Add Designation
          </DialogTitle>
          <DialogDescription className="text-xs">
            Create a new job title / designation for the organization.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Designation Name</label>
            <Input
              required
              placeholder="e.g. Manager, Senior Developer"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="h-10 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
            <Input
              placeholder="Short description"
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              className="h-10 text-sm"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading ? "Saving..." : "Save Designation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

