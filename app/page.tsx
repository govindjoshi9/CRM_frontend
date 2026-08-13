'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, getPortalRoute } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const targetPortal = getPortalRoute();
      router.replace(targetPortal);
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, getPortalRoute, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
