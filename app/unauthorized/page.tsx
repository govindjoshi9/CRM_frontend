'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { getPortalRoute, logout } = useAuthStore();

  const handleReturn = () => {
    const portal = getPortalRoute();
    router.replace(portal);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/40 text-center">
        <CardHeader className="space-y-2 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">403 - Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You do not have permission to access this portal or resource.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          Your current account role does not possess the permissions required for this route. Please return to your designated portal.
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          <Button className="w-full gap-2" onClick={handleReturn}>
            <ArrowLeft className="h-4 w-4" />
            Go to My Portal
          </Button>
          <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => { logout(); router.replace('/login'); }}>
            Sign out and switch account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
