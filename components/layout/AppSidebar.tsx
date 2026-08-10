'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  WalletCards, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sales & CRM', href: '/sales', icon: ShoppingCart },
  { name: 'Purchases', href: '/purchases', icon: Package },
  { name: 'HR & Payroll', href: '/hr', icon: Users },
  { name: 'Accounting', href: '/accounting', icon: WalletCards },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-slate-950 text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wider">ERP<span className="text-blue-500">System</span></h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          v1.0.0 Enterprise
        </div>
      </div>
    </aside>
  );
}
