'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Lock, Mail, ArrowRight, Shield,
  Building2, AlertCircle, Loader2, Landmark
} from 'lucide-react';
import apiClient from '@/lib/axios';

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
    <div className="login-root">
      {/* Left panel – branding */}
      <div className="login-panel-left">
        <div className="login-brand">
          <div className="login-logo-ring">
            <Building2 className="login-logo-icon" />
          </div>
          <h1 className="login-brand-title">Enterprise CRM</h1>
          <p className="login-brand-sub">
            Register your business to set up your administration workspace.
          </p>
        </div>

        <ul className="login-features">
          {[
            { label: 'Create your secure tenant workspace' },
            { label: 'Set up administrative credentials' },
            { label: 'Configure industry defaults' },
            { label: 'Ready-to-use ledger & charts' },
          ].map((f) => (
            <li key={f.label} className="login-feature-item">
              <span className="login-feature-dot" />
              {f.label}
            </li>
          ))}
        </ul>

        <p className="login-version">v1.0 · Enterprise Edition</p>
      </div>

      {/* Right panel – form */}
      <div className="login-panel-right">
        <div className="login-form-card">
          {/* Header */}
          <div className="login-form-header">
            <div className="login-shield-badge">
              <Landmark className="login-shield-icon" />
            </div>
            <h2 className="login-form-title">Create Workspace</h2>
            <p className="login-form-desc">
              Register a new organization and default administrator.
            </p>
          </div>

          {/* Success / Error alerts */}
          {success && (
            <div className="register-success" role="alert">
              <span>Account registered successfully! Redirecting to login...</span>
            </div>
          )}

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            {/* Business Name */}
            <div className="login-field">
              <label htmlFor="register-business" className="login-label">
                Company / Business Name
              </label>
              <div className="login-input-wrap">
                <Building2 className="login-input-icon" />
                <input
                  id="register-business"
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  className={`login-input ${errors.business ? 'login-input--error' : ''}`}
                  {...register('business')}
                />
              </div>
              {errors.business && (
                <p className="login-field-error">{errors.business.message}</p>
              )}
            </div>

            {/* Industry */}
            <div className="login-field">
              <label htmlFor="register-industry" className="login-label">
                Industry Sector
              </label>
              <div className="login-input-wrap">
                <Building2 className="login-input-icon" />
                <select
                  id="register-industry"
                  className={`login-input appearance-none ${errors.industry ? 'login-input--error' : ''}`}
                  {...register('industry')}
                  style={{ paddingRight: '20px' }}
                >
                  <option value="" disabled>Select industry type</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Services">Professional Services</option>
                  <option value="Manufacturing">Manufacturing & Distribution</option>
                  <option value="Tech">Technology & SaaS</option>
                  <option value="Other">Other / General ERP</option>
                </select>
              </div>
              {errors.industry && (
                <p className="login-field-error">{errors.industry.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="login-field">
              <label htmlFor="register-email" className="login-label">
                Admin Email Address
              </label>
              <div className="login-input-wrap">
                <Mail className="login-input-icon" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="admin@company.com"
                  className={`login-input ${errors.email ? 'login-input--error' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="login-field-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="register-password" className="login-label">
                Admin Password
              </label>
              <div className="login-input-wrap">
                <Lock className="login-input-icon" />
                <input
                  id="register-password"
                  type="password"
                  placeholder="Create secure password"
                  className={`login-input ${errors.password ? 'login-input--error' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="login-field-error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading || success}
              id="register-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Workspace…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <div className="login-footer-badge">
              <Shield className="h-3.5 w-3.5" />
              Secured Connection
            </div>
            <p className="login-footer-note">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline font-semibold" style={{ color: '#818cf8' }}>
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Inline styles mapping exactly to login layout */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .login-root {
          font-family: 'Inter', sans-serif;
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .login-panel-left {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 52px;
          background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 60%, #f8fafc 100%);
          border-right: 1px solid rgba(99,102,241,.15);
          position: relative;
          overflow: hidden;
        }
        .login-panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 0% 0%, rgba(99,102,241,.1) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 100% 100%, rgba(139,92,246,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (min-width: 1024px) { .login-panel-left { display: flex; flex: 1; } }

        .login-brand { position: relative; z-index: 1; }
        .login-logo-ring {
          width: 60px; height: 60px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(99,102,241,.3);
        }
        .login-logo-icon { width: 30px; height: 30px; color: #fff; }
        .login-brand-title {
          font-size: 28px; font-weight: 800;
          color: #0f172a; margin: 0 0 10px;
          letter-spacing: -.5px;
        }
        .login-brand-sub {
          font-size: 14px; color: #475569;
          line-height: 1.6; margin: 0;
        }

        .login-features {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 14px;
          position: relative; z-index: 1;
        }
        .login-feature-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: #475569;
          font-weight: 500;
        }
        .login-feature-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(99,102,241,.4);
        }
        .login-version {
          font-size: 11px; color: #94a3b8;
          position: relative; z-index: 1;
        }

        .login-panel-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 20px;
          background: #f8fafc;
        }
        .login-form-card {
          width: 100%; max-width: 420px;
          background: #ffffff;
          border: 1px solid rgba(148,163,184,.2);
          border-radius: 20px;
          padding: 44px 40px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 20px 40px -10px rgba(0, 0, 0, 0.08);
        }

        .login-form-header { text-align: center; margin-bottom: 28px; }
        .login-shield-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(79,70,229,.1), rgba(124,58,237,.08));
          border: 1px solid rgba(99,102,241,.15);
          margin-bottom: 18px;
        }
        .login-shield-icon { width: 24px; height: 24px; color: #6366f1; }
        .login-form-title {
          font-size: 24px; font-weight: 700;
          color: #0f172a; margin: 0 0 8px;
          letter-spacing: -.4px;
        }
        .login-form-desc {
          font-size: 13px; color: #64748b;
          line-height: 1.6; margin: 0;
        }

        .register-success {
          padding: 12px 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          color: #15803d;
          font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
        }

        .login-error {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #ef4444;
          font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
          animation: errIn .2s ease;
        }
        @keyframes errIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }

        .login-form { display: flex; flex-direction: column; gap: 16px; }

        .login-field { display: flex; flex-direction: column; gap: 6px; }
        .login-label {
          font-size: 12.5px; font-weight: 600;
          color: #334155;
          letter-spacing: .3px;
        }
        .login-input-wrap { position: relative; }
        .login-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          width: 16px; height: 16px; color: #94a3b8;
          pointer-events: none;
        }
        .login-input {
          width: 100%; padding: 12px 14px 12px 42px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #0f172a;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
          box-sizing: border-box;
        }
        .login-input option {
          background-color: #ffffff;
          color: #0f172a;
        }
        .login-input::placeholder { color: #94a3b8; }
        .login-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,.15);
          background: #ffffff;
        }
        .login-input--error { border-color: #ef4444 !important; }
        .login-input--error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.15) !important; }

        .login-field-error {
          font-size: 11.5px; color: #ef4444;
          margin: 0;
        }

        .login-submit-btn {
          width: 100%; height: 48px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #fff;
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          letter-spacing: .2px;
          transition: opacity .2s, transform .1s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(99,102,241,.3);
          margin-top: 10px;
        }
        .login-submit-btn:hover:not(:disabled) {
          opacity: .92;
          box-shadow: 0 6px 20px rgba(99,102,241,.4);
          transform: translateY(-1px);
        }
        .login-submit-btn:disabled { opacity: .55; cursor: not-allowed; }

        .login-footer {
          margin-top: 24px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        .login-footer-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 500;
          color: #6366f1;
        }
        .login-footer-note {
          font-size: 11px; color: #64748b;
          text-align: center; margin: 0;
        }
      `}</style>
    </div>
  );
}
