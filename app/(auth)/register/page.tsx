'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Lock, Mail, ArrowRight, Shield,
  Building2, AlertCircle, Loader2, Landmark, CheckCircle2
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const registerSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  business: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  industry: z.string().min(2, { message: 'Industry selection is required.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', business: '', industry: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/register', {
        email: values.email,
        password: values.password,
        business: values.business,
        industry: values.industry,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      // @ts-expect-error - Catch block typing bypass
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-14 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-50 border-r border-indigo-500/15 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 0% 0%, rgba(99,102,241,.1) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 100% 100%, rgba(139,92,246,.08) 0%, transparent 70%)
          `
        }} />
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(99,102,241,0.3)]">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Enterprise CRM</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Register your business to set up your administration workspace.
          </p>
        </div>

        <ul className="flex flex-col gap-4 relative z-10">
          {[
            'Create your secure tenant workspace',
            'Set up administrative credentials',
            'Configure industry defaults',
            'Ready-to-use ledger & charts',
          ].map((label) => (
            <li key={label} className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              {label}
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400 relative z-10 font-medium">v1.0 · Enterprise Edition</p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-3xl p-10 shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/15 mb-5">
              <Landmark className="w-6 h-6 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Create Workspace</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Register a new organization and default administrator.
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-700 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 stroke-green-700" />
              <AlertDescription className="text-xs font-medium">
                Account registered successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-sm font-semibold text-slate-700">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@company.com"
                  className={`pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-sm shadow-none ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  {...register('email')}
                  disabled={success}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className={`pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-sm shadow-none ${errors.password ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  {...register('password')}
                  disabled={success}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Business Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-business" className="text-sm font-semibold text-slate-700">
                Business / Workspace Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="reg-business"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className={`pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-sm shadow-none ${errors.business ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  {...register('business')}
                  disabled={success}
                />
              </div>
              {errors.business && (
                <p className="text-xs text-red-500 mt-1">{errors.business.message}</p>
              )}
            </div>

            {/* Industry Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-industry" className="text-sm font-semibold text-slate-700">
                Industry
              </label>
              <div className="relative">
                <select
                  id="reg-industry"
                  className={`w-full h-12 px-3.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-colors shadow-none appearance-none ${errors.industry ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  {...register('industry')}
                  disabled={success}
                >
                  <option value="" disabled className="text-slate-500">Select Industry</option>
                  <option value="Tech">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.industry && (
                <p className="text-xs text-red-500 mt-1">{errors.industry.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 shadow-[0_4px_14px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] transition-all text-sm font-bold text-white"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Workspace…
                </>
              ) : (
                <>
                  Register Workspace
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500">
              <Shield className="w-3.5 h-3.5" />
              Secured with AES-256 Encryption
            </div>
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-500 hover:underline font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
