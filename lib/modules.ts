import {
  LayoutDashboard,
  Users,
  UserCircle,
  ShoppingCart,
  Package,
  Warehouse,
  ArrowLeftRight,
  Truck,
  Undo2,
  FileText,
  Receipt,
  CreditCard,
  Wallet,
  Banknote,
  Landmark,
  BookOpen,
  Scale,
  Calculator,
  ReceiptIndianRupee,
  Percent,
  FileSpreadsheet,
  PieChart,
  Briefcase,
  FolderKanban,
  ListTodo,
  Clock,
  UserCog,
  CalendarDays,
  CalendarCheck,
  GraduationCap,
  Building2,
  Network,
  LifeBuoy,
  Bot,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface ModuleEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;            // path relative to module prefix
  description: string;
  /** Roles allowed (from authorize() middleware). Empty = any authenticated user */
  roles?: string[];
}

export interface ModuleDef {
  /** Stable slug used as React key + route segment */
  slug: string;
  /** Human label shown in sidebar */
  label: string;
  /** Short description (used in cards / search) */
  description: string;
  /** Icon */
  icon: LucideIcon;
  /** REST prefix as mounted on the backend, e.g. /api/items */
  prefix: string;
  /** Sidebar group */
  group: ModuleGroup;
  /** Whether the page has been built in this starter (most are "preview") */
  status: "ready" | "preview";
  /** Endpoints exposed by this module (for the developer panel) */
  endpoints: ModuleEndpoint[];
}

export type ModuleGroup =
  | "Overview"
  | "Sales & CRM"
  | "Purchase"
  | "Inventory"
  | "Accounting"
  | "Banking & Payments"
  | "Tax & Compliance"
  | "HR & Payroll"
  | "Projects"
  | "Customer Support"
  | "AI Assistant"
  | "Administration";

export const MODULE_GROUPS: ModuleGroup[] = [
  "Overview",
  "Sales & CRM",
  "Purchase",
  "Inventory",
  "Accounting",
  "Banking & Payments",
  "Tax & Compliance",
  "HR & Payroll",
  "Projects",
  "Customer Support",
  "AI Assistant",
  "Administration",
];

export const MODULES: ModuleDef[] = [
  /* ----------------------------- Overview ----------------------------- */
  {
    slug: "dashboard",
    label: "Dashboard",
    description: "KPIs, recent activity, quick actions",
    icon: LayoutDashboard,
    prefix: "",
    group: "Overview",
    status: "ready",
    endpoints: [],
  },

  /* --------------------------- Sales & CRM --------------------------- */
  {
    slug: "leads",
    label: "Leads",
    description: "Lead pipeline, scoring, follow-ups",
    icon: Sparkles,
    prefix: "/api/leads",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List leads (filter by status/stage)" },
      { method: "POST", path: "/", description: "Create lead", roles: ["admin", "staff"] },
      { method: "GET", path: "/:id", description: "Lead detail + activities + reminders" },
      { method: "PUT", path: "/:id", description: "Update lead", roles: ["admin", "staff"] },
      { method: "DELETE", path: "/:id", description: "Delete lead", roles: ["admin"] },
    ],
  },
  {
    slug: "parties",
    label: "Parties (Customers / Vendors)",
    description: "Customers, vendors, ledger, purse wallet, cart",
    icon: Users,
    prefix: "/api/parties",
    group: "Sales & CRM",
    status: "ready",
    endpoints: [
      { method: "GET", path: "/", description: "List all parties" },
      { method: "POST", path: "/", description: "Create party", roles: ["admin", "staff"] },
      { method: "GET", path: "/:id", description: "Party detail" },
      { method: "GET", path: "/:id/ledger", description: "Party ledger entries" },
      { method: "GET", path: "/:id/purse", description: "Party wallet balance" },
      { method: "POST", path: "/:id/purse/add", description: "Top up party wallet" },
      { method: "GET", path: "/:id/cart", description: "Party cart contents" },
      { method: "POST", path: "/:id/cart/add", description: "Add to party cart" },
      { method: "DELETE", path: "/:id/cart/remove", description: "Remove from cart" },
    ],
  },
  {
    slug: "quotations",
    label: "Quotations",
    description: "Quotation builder, public accept link, PDF",
    icon: FileText,
    prefix: "/api/quotation",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List quotations" },
      { method: "POST", path: "/", description: "Create quotation" },
      { method: "GET", path: "/:id", description: "Quotation detail" },
      { method: "PUT", path: "/:id", description: "Update quotation" },
      { method: "POST", path: "/:id/send", description: "Send public accept link" },
    ],
  },
  {
    slug: "orders",
    label: "Orders",
    description: "Sales orders, fulfillment tracking",
    icon: ShoppingCart,
    prefix: "/api/orders",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List orders" },
      { method: "POST", path: "/", description: "Create order" },
      { method: "GET", path: "/:id", description: "Order detail" },
      { method: "PUT", path: "/:id/status", description: "Update status" },
    ],
  },
  {
    slug: "billing",
    label: "Invoices / Billing",
    description: "Tax invoices, POS billing, e-invoice IRN",
    icon: Receipt,
    prefix: "/api/billing",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List invoices" },
      { method: "POST", path: "/", description: "Create invoice" },
      { method: "GET", path: "/:id", description: "Invoice detail" },
      { method: "POST", path: "/:id/payment", description: "Record payment" },
    ],
  },
  {
    slug: "credit-notes",
    label: "Credit Notes",
    description: "Sales credit notes, adjustments",
    icon: FileText,
    prefix: "/api/credit-notes",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List credit notes" },
      { method: "POST", path: "/", description: "Create credit note" },
    ],
  },
  {
    slug: "sales-returns",
    label: "Sales Returns",
    description: "Return merchandise authorization",
    icon: Undo2,
    prefix: "/api/sales-returns",
    group: "Sales & CRM",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List returns" },
      { method: "POST", path: "/", description: "Create return" },
    ],
  },

  /* ----------------------------- Purchase ----------------------------- */
  {
    slug: "purchase-invoices",
    label: "Purchase Invoices",
    description: "Vendor bills, OCR ingest, auto-posting",
    icon: ReceiptIndianRupee,
    prefix: "/api/purchases",
    group: "Purchase",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List purchase invoices" },
      { method: "POST", path: "/", description: "Create purchase invoice" },
      { method: "POST", path: "/ingest", description: "OCR vendor bill upload" },
      { method: "GET", path: "/:id", description: "Invoice detail" },
    ],
  },
  {
    slug: "purchase-drafts",
    label: "Purchase Drafts",
    description: "Drafts before becoming invoices",
    icon: FileText,
    prefix: "/api/purchase-drafts",
    group: "Purchase",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List drafts" },
      { method: "POST", path: "/", description: "Create draft" },
      { method: "POST", path: "/:id/confirm", description: "Convert to invoice" },
    ],
  },
  {
    slug: "purchase-returns",
    label: "Purchase Returns",
    description: "Return to vendor (debit note trigger)",
    icon: Undo2,
    prefix: "/api/purchase-returns",
    group: "Purchase",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List returns" },
      { method: "POST", path: "/", description: "Create return" },
    ],
  },
  {
    slug: "debit-notes",
    label: "Debit Notes",
    description: "Vendor debit adjustments",
    icon: FileText,
    prefix: "/api/debit-notes",
    group: "Purchase",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List debit notes" },
      { method: "POST", path: "/", description: "Create debit note" },
    ],
  },

  /* ----------------------------- Inventory ----------------------------- */
  {
    slug: "items",
    label: "Items & Services",
    description: "Products, services, SKU, pricing, HSN",
    icon: Package,
    prefix: "/api/items",
    group: "Inventory",
    status: "ready",
    endpoints: [
      { method: "GET", path: "/", description: "List items" },
      { method: "POST", path: "/create", description: "Create item", roles: ["admin", "staff"] },
      { method: "GET", path: "/barcode/:sku", description: "POS barcode lookup" },
      { method: "GET", path: "/:id/with-stock", description: "Item with branch stock" },
      { method: "PUT", path: "/:id", description: "Update item", roles: ["admin", "staff"] },
      { method: "DELETE", path: "/:id", description: "Delete item", roles: ["admin"] },
    ],
  },
  {
    slug: "inventory",
    label: "Inventory",
    description: "Stock levels, batches, valuation, reservation",
    icon: Warehouse,
    prefix: "/api/inventory",
    group: "Inventory",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List inventory by branch" },
      { method: "POST", path: "/adjust", description: "Stock adjustment" },
      { method: "GET", path: "/valuation", description: "Stock valuation report" },
    ],
  },
  {
    slug: "stock-transfers",
    label: "Stock Transfers",
    description: "Branch-to-branch transfers",
    icon: ArrowLeftRight,
    prefix: "/api/stock-transfers",
    group: "Inventory",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List transfers" },
      { method: "POST", path: "/", description: "Create transfer" },
    ],
  },
  {
    slug: "assets",
    label: "Fixed Assets",
    description: "Asset register, depreciation",
    icon: Truck,
    prefix: "/api/assets",
    group: "Inventory",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List assets" },
      { method: "POST", path: "/", description: "Create asset" },
    ],
  },

  /* ---------------------------- Accounting ---------------------------- */
  {
    slug: "chart-of-accounts",
    label: "Chart of Accounts",
    description: "Account groups, ledger master, COA tree",
    icon: BookOpen,
    prefix: "/api/chart-of-accounts",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List accounts (tree)" },
      { method: "POST", path: "/", description: "Create account" },
      { method: "GET", path: "/:id/balance", description: "Account balance" },
    ],
  },
  {
    slug: "journal-posting",
    label: "Journal Vouchers",
    description: "Manual journal entries, double-entry posting",
    icon: Scale,
    prefix: "/api/journals",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List journal entries" },
      { method: "POST", path: "/", description: "Post journal entry" },
      { method: "POST", path: "/:id/reverse", description: "Reverse entry" },
    ],
  },
  {
    slug: "general-ledger",
    label: "General Ledger",
    description: "GL transactions by account",
    icon: BookOpen,
    prefix: "/api/general-ledger",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "GL report (filterable)" },
    ],
  },
  {
    slug: "trial-balance",
    label: "Trial Balance",
    description: "Debit/Credit balances by account",
    icon: Calculator,
    prefix: "/api/trial-balance",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "Trial balance report" },
    ],
  },
  {
    slug: "financial-statements",
    label: "P&L / Balance Sheet",
    description: "Profit & Loss, Balance Sheet, Fund Flow",
    icon: PieChart,
    prefix: "/api/financial-statements",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/profit-loss", description: "P&L statement" },
      { method: "GET", path: "/balance-sheet", description: "Balance sheet" },
      { method: "GET", path: "/fund-flow", description: "Fund flow statement" },
    ],
  },
  {
    slug: "cashbook",
    label: "Cash & Day Book",
    description: "Cash book, day book, bank book",
    icon: BookOpen,
    prefix: "/api/books",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/cash", description: "Cash book" },
      { method: "GET", path: "/day", description: "Day book" },
      { method: "GET", path: "/bank", description: "Bank book" },
    ],
  },
  {
    slug: "party-ledger",
    label: "Party Ledger",
    description: "Customer/vendor ledger statements",
    icon: BookOpen,
    prefix: "/api/party-ledgers",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List ledgers" },
      { method: "GET", path: "/:partyId", description: "Statement for a party" },
    ],
  },
  {
    slug: "voucher-sequence",
    label: "Voucher Sequences",
    description: "Numbering for invoices, vouchers, receipts",
    icon: FileSpreadsheet,
    prefix: "/api/voucher-sequence",
    group: "Accounting",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List sequences" },
      { method: "POST", path: "/", description: "Create sequence" },
    ],
  },

  /* ----------------------- Banking & Payments ----------------------- */
  {
    slug: "banking",
    label: "Bank Accounts",
    description: "Bank accounts, reconciliation, transactions",
    icon: Landmark,
    prefix: "/api/banking",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List bank accounts" },
      { method: "POST", path: "/", description: "Add bank account" },
      { method: "GET", path: "/:id/transactions", description: "Transactions" },
      { method: "POST", path: "/:id/reconcile", description: "Auto reconcile" },
    ],
  },
  {
    slug: "payments",
    label: "Payments",
    description: "Receipts & payments, modes, links",
    icon: CreditCard,
    prefix: "/api/payments",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List payments" },
      { method: "POST", path: "/", description: "Record payment" },
    ],
  },
  {
    slug: "expenses",
    label: "Expenses",
    description: "Expense entry, multi-line, attachments",
    icon: Wallet,
    prefix: "/api/expenses",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List expenses" },
      { method: "POST", path: "/", description: "Create expense" },
      { method: "GET", path: "/:id", description: "Expense detail" },
    ],
  },
  {
    slug: "expense-categories",
    label: "Expense Categories",
    description: "Categories & items for expenses",
    icon: Wallet,
    prefix: "/api/expense-categories",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List categories" },
      { method: "POST", path: "/", description: "Create category" },
    ],
  },
  {
    slug: "recurring-expenses",
    label: "Recurring Expenses",
    description: "Auto-recurring bills (rent, salary, SaaS)",
    icon: Banknote,
    prefix: "/api/recurring-expenses",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List recurring rules" },
      { method: "POST", path: "/", description: "Create rule" },
    ],
  },
  {
    slug: "purse",
    label: "Purse (Wallet)",
    description: "Customer prepaid wallet top-ups & usage",
    icon: Wallet,
    prefix: "/api/purses",
    group: "Banking & Payments",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List wallets" },
      { method: "POST", path: "/topup", description: "Top up wallet" },
    ],
  },

  /* ------------------------- Tax & Compliance ------------------------- */
  {
    slug: "tax-engine",
    label: "Tax Engine",
    description: "GST, cess, TDS/TCS calculation & ledgers",
    icon: Percent,
    prefix: "/api/tax-engine",
    group: "Tax & Compliance",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "Tax config + summary" },
      { method: "GET", path: "/ledger", description: "Tax ledger entries" },
    ],
  },
  {
    slug: "gst-reports",
    label: "GST Reports",
    description: "GSTR-1, GSTR-3B, GSTR-2B reconciliations",
    icon: FileSpreadsheet,
    prefix: "/api/gst/reports",
    group: "Tax & Compliance",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/gstr-1", description: "GSTR-1 report" },
      { method: "GET", path: "/gstr-3b", description: "GSTR-3B report" },
    ],
  },
  {
    slug: "tds-tcs-reports",
    label: "TDS / TCS Reports",
    description: "TDS deductions, challans, Form 26Q",
    icon: FileSpreadsheet,
    prefix: "/api/tds-tcs/reports",
    group: "Tax & Compliance",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "TDS/TCS report" },
    ],
  },
  {
    slug: "form16",
    label: "Form 16",
    description: "Employee Form 16 generation, Part A/B",
    icon: FileText,
    prefix: "/api/form16",
    group: "Tax & Compliance",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List Form 16 docs" },
      { method: "POST", path: "/generate", description: "Generate Form 16" },
    ],
  },

  /* ---------------------------- HR & Payroll ---------------------------- */
  {
    slug: "employees",
    label: "Employees",
    description: "Employee master, salary, branch access",
    icon: UserCircle,
    prefix: "/api/employees",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List employees" },
      { method: "POST", path: "/", description: "Create employee" },
      { method: "GET", path: "/:id", description: "Employee detail" },
    ],
  },
  {
    slug: "departments",
    label: "Departments",
    description: "Org departments",
    icon: Building2,
    prefix: "/api/departments",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List departments" },
      { method: "POST", path: "/", description: "Create department" },
    ],
  },
  {
    slug: "designations",
    label: "Designations",
    description: "Job titles / designations",
    icon: UserCog,
    prefix: "/api/designations",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List designations" },
      { method: "POST", path: "/", description: "Create designation" },
    ],
  },
  {
    slug: "attendance",
    label: "Attendance",
    description: "Daily attendance, summaries",
    icon: CalendarCheck,
    prefix: "/api/attendance",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List attendance" },
      { method: "POST", path: "/check-in", description: "Check in" },
      { method: "POST", path: "/check-out", description: "Check out" },
    ],
  },
  {
    slug: "leaves",
    label: "Leaves",
    description: "Leave applications & approvals",
    icon: CalendarDays,
    prefix: "/api/leaves",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List leave requests" },
      { method: "POST", path: "/", description: "Apply leave" },
      { method: "POST", path: "/:id/approve", description: "Approve / reject" },
    ],
  },
  {
    slug: "payroll",
    label: "Payroll Runs",
    description: "Monthly payroll runs, processing",
    icon: Wallet,
    prefix: "/api/payrolls",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List payroll runs" },
      { method: "POST", path: "/", description: "Create run" },
      { method: "POST", path: "/:id/process", description: "Process payroll" },
    ],
  },
  {
    slug: "payslips",
    label: "Payslips",
    description: "Generated payslips, PDF download",
    icon: FileText,
    prefix: "/api/payslips",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List payslips" },
      { method: "GET", path: "/:id/pdf", description: "Download PDF" },
    ],
  },
  {
    slug: "appointments",
    label: "Appointments",
    description: "Appointment letters",
    icon: FileText,
    prefix: "/api/appointments",
    group: "HR & Payroll",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List appointments" },
      { method: "POST", path: "/", description: "Issue appointment" },
    ],
  },

  /* ------------------------------ Projects ------------------------------ */
  {
    slug: "projects",
    label: "Projects",
    description: "Project management, milestones, billing",
    icon: FolderKanban,
    prefix: "/api/projects",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List projects" },
      { method: "POST", path: "/", description: "Create project" },
      { method: "GET", path: "/:id", description: "Project detail" },
    ],
  },
  {
    slug: "tasks",
    label: "Tasks",
    description: "Tasks within projects, kanban",
    icon: ListTodo,
    prefix: "/api/tasks",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List tasks" },
      { method: "POST", path: "/", description: "Create task" },
      { method: "PUT", path: "/:id", description: "Update task" },
    ],
  },
  {
    slug: "timesheets",
    label: "Timesheets",
    description: "Time entries per task/project",
    icon: Clock,
    prefix: "/api/timesheets",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List entries" },
      { method: "POST", path: "/", description: "Log time" },
    ],
  },
  {
    slug: "project-members",
    label: "Project Members",
    description: "Team assignment per project",
    icon: Users,
    prefix: "/api/project-members",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List members" },
      { method: "POST", path: "/", description: "Add member" },
    ],
  },
  {
    slug: "resource-assignments",
    label: "Resource Assignments",
    description: "Assign resources/equipment to projects",
    icon: Briefcase,
    prefix: "/api/resource-assignments",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List assignments" },
      { method: "POST", path: "/", description: "Assign resource" },
    ],
  },
  {
    slug: "resources",
    label: "Resources",
    description: "Equipment, rooms, vehicles, etc.",
    icon: Network,
    prefix: "/api/resources",
    group: "Projects",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List resources" },
      { method: "POST", path: "/", description: "Create resource" },
    ],
  },

  /* -------------------------- Customer Support -------------------------- */
  {
    slug: "support",
    label: "Support Tickets",
    description: "Tickets, SLA, threads, WhatsApp",
    icon: LifeBuoy,
    prefix: "/api/support",
    group: "Customer Support",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List tickets" },
      { method: "POST", path: "/", description: "Create ticket" },
      { method: "GET", path: "/:id", description: "Ticket thread" },
      { method: "POST", path: "/:id/reply", description: "Reply" },
    ],
  },
  {
    slug: "client-auth",
    label: "Client Portal Auth",
    description: "Client login tokens, portal access",
    icon: GraduationCap,
    prefix: "/api/client-auth",
    group: "Customer Support",
    status: "preview",
    endpoints: [
      { method: "POST", path: "/request-otp", description: "Request OTP" },
      { method: "POST", path: "/verify-otp", description: "Verify OTP" },
    ],
  },

  /* ----------------------------- AI Assistant ----------------------------- */
  {
    slug: "ai-assistant",
    label: "AI Assistant",
    description: "Conversational AI, anomaly detection, tools",
    icon: Bot,
    prefix: "/api/ai",
    group: "AI Assistant",
    status: "preview",
    endpoints: [
      { method: "POST", path: "/chat", description: "Chat with AI (streaming)" },
      { method: "GET", path: "/conversations", description: "List conversations" },
      { method: "GET", path: "/anomalies", description: "Anomaly alerts" },
    ],
  },

  /* --------------------------- Administration --------------------------- */

  {
    slug: "branches",
    label: "Branches / Warehouses",
    description: "Branch master, switch active branch",
    icon: Building2,
    prefix: "/api/branches",
    group: "Administration",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List branches" },
      { method: "POST", path: "/", description: "Create branch" },
    ],
  },
  {
    slug: "users",
    label: "Users & Roles",
    description: "User accounts, role assignments, permissions",
    icon: UserCog,
    prefix: "/api/users",
    group: "Administration",
    status: "ready",
    endpoints: [
      { method: "GET", path: "/", description: "List all users in workspace" },
      { method: "POST", path: "/", description: "Add new user with role", roles: ["admin", "hr"] },
      { method: "PUT", path: "/:id/role", description: "Change user role", roles: ["admin"] },
      { method: "PUT", path: "/:id/status", description: "Update status (active/inactive)", roles: ["admin", "hr"] },
      { method: "DELETE", path: "/:id", description: "Delete user", roles: ["admin"] },
    ],
  },
  {
    slug: "business-profile",
    label: "Business Profile",
    description: "Manage business settings and tax compliance",
    icon: Building2,
    prefix: "/api/business/me",
    group: "Administration",
    status: "ready",
    endpoints: [
      { method: "GET", path: "/", description: "Get my business profile" },
      { method: "PUT", path: "/", description: "Update my business profile" },
    ],
  },
  {
    slug: "settings",
    label: "Settings",
    description: "Business preferences, invoice templates",
    icon: Settings,
    prefix: "/api/settings",
    group: "Administration",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "Get settings" },
      { method: "PUT", path: "/", description: "Update settings" },
    ],
  },
  {
    slug: "integrations",
    label: "Integrations",
    description: "Razorpay, Twilio, AWS S3, Google AI",
    icon: Network,
    prefix: "/api/integrations",
    group: "Administration",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List integrations" },
      { method: "POST", path: "/:key", description: "Configure integration" },
    ],
  },
  {
    slug: "exports",
    label: "Exports",
    description: "Excel / CSV / PDF exports across modules",
    icon: FileSpreadsheet,
    prefix: "/api/exports",
    group: "Administration",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/:module", description: "Export module data" },
    ],
  },
  {
    slug: "registrations",
    label: "Registrations",
    description: "Public signups / lead-from-form",
    icon: UserCircle,
    prefix: "/api/registrations",
    group: "Administration",
    status: "preview",
    endpoints: [
      { method: "GET", path: "/", description: "List registrations" },
      { method: "POST", path: "/", description: "Create (public)" },
    ],
  },
];

/* -------------------------------- Selectors -------------------------------- */

export function getModulesByGroup(): Record<ModuleGroup, ModuleDef[]> {
  const grouped = {} as Record<ModuleGroup, ModuleDef[]>;
  for (const g of MODULE_GROUPS) grouped[g] = [];
  for (const m of MODULES) grouped[m.group].push(m);
  return grouped;
}

export function getModule(slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export const TOTAL_MODULE_COUNT = MODULES.length;
export const READY_MODULE_COUNT = MODULES.filter((m) => m.status === "ready").length;
