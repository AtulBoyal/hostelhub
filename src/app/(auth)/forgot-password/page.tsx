'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Google login error:', error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Hostel<span className="text-blue-600">Hub</span></span>
          </div>
          <CardTitle className="text-2xl">Password Assistance</CardTitle>
          <CardDescription>HostelHub uses Google Sign-In for account authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 leading-relaxed text-center">
            Your account is linked to your Google account. You do not need a separate password for HostelHub. If you wish to change your password, you can do so in the Personal Info settings inside HostelHub.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-slate-300 border-t-white" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </Button>
          
          <Link href="/login" className="inline-flex items-center justify-center w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-2 px-4 text-sm font-medium transition-colors">
            Back to Login
          </Link>
          
          {/* Subtle link for legacy email users */}
          <div className="pt-2 text-center">
            <Link href="/reset-password" className="text-[10px] text-slate-400 hover:text-slate-500 hover:underline">
              Legacy email user? Reset password here.
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
