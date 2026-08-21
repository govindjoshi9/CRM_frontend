import { useState } from "react";
import {
  UserCog,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeeService, Department, Designation } from "@/lib/services/employee.service";

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  designations: Designation[];
  onSuccess: () => void;
}

export function EmployeeFormDialog({
  isOpen,
  onOpenChange,
  departments,
  designations,
  onSuccess,
}: EmployeeFormDialogProps) {
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    joiningDate: new Date().toISOString().split("T")[0],
    basicSalary: "0",
    departmentId: "",
    designationId: "",
    role: "staff", // Will be passed to User creation
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await EmployeeService.createEmployee(addForm);
      
      let successMsg = "User/Employee created successfully!";
      if (res.login?.tempPassword) {
        successMsg = `Created successfully! Auto-generated Password: ${res.login.tempPassword} (Please copy this for the user)`;
      } else if (res.login?.note) {
        successMsg = `Created successfully! ${res.login.note}`;
      }

      setSuccess(successMsg);
      setAddForm({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        joiningDate: new Date().toISOString().split("T")[0],
        basicSalary: "0",
        departmentId: "",
        designationId: "",
        role: "staff",
      });
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
        onSuccess();
      }, 6000); // Increased timeout so they have time to copy the password
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } } };
      const msg = errorObj.response?.data?.error || "Failed to create user";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-600" />
            Add New Member
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            This will create an Employee profile and automatically generate a User login
            (password will be auto-generated).
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  placeholder="Name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  placeholder="Email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  required
                  placeholder="Phone"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Basic Salary</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="number"
                  required
                  placeholder="Salary"
                  value={addForm.basicSalary}
                  onChange={(e) => setAddForm({ ...addForm, basicSalary: e.target.value })}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Department</label>
              <select
                required
                value={addForm.departmentId}
                onChange={(e) => setAddForm({ ...addForm, departmentId: e.target.value })}
                className="h-10 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Designation</label>
              <select
                required
                value={addForm.designationId}
                onChange={(e) => setAddForm({ ...addForm, designationId: e.target.value })}
                className="h-10 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="" disabled>
                  Select Designation
                </option>
                {designations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">System Role</label>
              <select
                required
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="h-10 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="accountant">Accountant</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Joining Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  required
                  value={addForm.joiningDate}
                  onChange={(e) => setAddForm({ ...addForm, joiningDate: e.target.value })}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? "Creating…" : "Create Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
