'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle2, AlertCircle, Building2, UserCircle } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation schemas for the two login types
const staffSchema = z.object({
  email: z.string().email({ message: 'Valid email is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const clientSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { loginStaff, loginClient } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Staff Form
  const staffForm = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: { email: '', password: '' },
  });

  // Client Form
  const clientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { username: '', password: '' },
  });

  const onStaffSubmit = async (values: z.infer<typeof staffSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { token, role, message } = response.data;
      
      // We don't have full user data from backend just yet except role in token,
      // but we can parse token or store what we have.
      loginStaff({ email: values.email, role }, token);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login as Staff');
    } finally {
      setIsLoading(false);
    }
  };

  const onClientSubmit = async (values: z.infer<typeof clientSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/client-auth/login', {
        username: values.username,
        password: values.password,
      });

      const { token, party } = response.data;
      loginClient(party, token);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login as Client');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/40 bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-muted/60">
              <TabsTrigger value="staff" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <UserCircle className="w-4 h-4 mr-2" />
                Staff / Admin
              </TabsTrigger>
              <TabsTrigger value="client" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Building2 className="w-4 h-4 mr-2" />
                Client / Party
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* STAFF LOGIN TAB */}
            <TabsContent value="staff" className="space-y-4 mt-0">
              <Form {...staffForm}>
                <form onSubmit={staffForm.handleSubmit(onStaffSubmit)} className="space-y-4">
                  <FormField
                    control={staffForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} className="h-11 bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={staffForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 mt-2 text-base shadow-md" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in as Staff'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* CLIENT LOGIN TAB */}
            <TabsContent value="client" className="space-y-4 mt-0">
              <Form {...clientForm}>
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                  <FormField
                    control={clientForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} className="h-11 bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 mt-2 text-base shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/80" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in as Client'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 text-center border-t border-border/40 pt-6 pb-6 mt-4">
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Secure Encrypted Connection
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
