'use client';

import RoleGuard from '@/components/auth/RoleGuard';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'staff', 'manager', 'employee', 'accountant', 'hr', 'ca', 'receptionist']}>
      {children}
    </RoleGuard>
  );
}
