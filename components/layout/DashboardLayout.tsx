'use client';

import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return null; // prevent hydration mismatch and flash of protected content
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AppSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
