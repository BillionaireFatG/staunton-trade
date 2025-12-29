'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordValid) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please sign in instead.');
          setLoading(false);
          return;
        }

        // Create initial profile entry
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
        });
        
        // If email confirmation is disabled or user is already confirmed
        if (data.user.confirmed_at || data.session) {
          router.push('/onboarding');
          router.refresh();
        } else {
          // Email confirmation required
          setSuccess(true);
          setLoading(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Show success message if email verification is required
  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-neutral-200">
          <Link href="/">
            <Logo size="sm" variant="dark" />
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Check your email</h1>
              <p className="text-neutral-600">
                We've sent a verification link to <strong>{email}</strong>
              </p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-neutral-700">
                Click the link in the email to verify your account and get started.
              </p>
              <p className="text-sm text-neutral-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-neutral-900 font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/sign-in"
                className="text-sm text-neutral-900 font-medium hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-neutral-200">
        <Link href="/">
          <Logo size="sm" variant="dark" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Create an account</h1>
            <p className="text-neutral-500 mt-1">Enter your details to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                {isPasswordValid ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-neutral-400" />
                )}
                At least 6 characters
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50"
              />
              {confirmPassword && (
                <div className="flex items-center gap-1.5 text-xs">
                  {passwordsMatch ? (
                    <>
                      <Check size={12} className="text-green-500" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X size={12} className="text-red-500" />
                      <span className="text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-neutral-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-neutral-400 border-t border-neutral-200">
        <Link href="/terms" className="hover:text-neutral-600">Terms</Link>
        {' · '}
        <Link href="/privacy" className="hover:text-neutral-600">Privacy</Link>
      </footer>
    </div>
  );
}
