'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { normalizeRole, BackendRole } from '@/lib/roleUtils';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: BackendRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, activeRole, getPortalRoute } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const currentRole = normalizeRole(user?.role, activeRole) as BackendRole;
    
    if (!allowedRoles.includes(currentRole)) {
      // If user isn't permitted on this route, send them to their own portal
      const targetPortal = getPortalRoute();
      if (window.location.pathname !== targetPortal) {
        router.replace(targetPortal);
      } else {
        router.replace('/unauthorized');
      }
    }
  }, [isMounted, isAuthenticated, user, activeRole, allowedRoles, getPortalRoute, router]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground font-medium">Authenticating & checking permissions...</p>
        </div>
      </div>
    );
  }

  const currentRole = normalizeRole(user?.role, activeRole) as BackendRole;
  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground font-medium">Redirecting to your authorized portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
