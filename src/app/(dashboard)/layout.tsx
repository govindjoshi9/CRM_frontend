import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
