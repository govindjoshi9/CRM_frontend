'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { mobile, password });
      const { user, token } = response.data;
      
      login(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please check your mobile number and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Ambient Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-md">
        {/* Top Logo & Title Badge */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise ERP Portal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            ERP<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">System</span>
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to access your dashboard, sales & accounting
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Mobile Field */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                Mobile Number
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <Input
                  id="mobile"
                  type="text"
                  placeholder="Enter 10-digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="pl-10 h-12 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </Label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950"
                />
                <span className="text-xs text-slate-400">Remember me for 30 days</span>
              </label>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 border-0 rounded-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Security Encrypted Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit SSL Encrypted Enterprise Protection</span>
        </div>
      </div>
    </div>
  );
}
