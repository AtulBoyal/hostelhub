'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeAuthCode } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const code = searchParams.get('code');
    const next = searchParams.get('next');
    
    if (!code) {
      setError(true);
      return;
    }

    const exchangeCode = async () => {
      try {
        const result = await exchangeAuthCode(code);
        if (result.error) {
          setError(true);
        } else if (result.success) {
          // Force a router refresh to ensure middleware sees the new cookie
          router.refresh();
          router.replace(next || result.redirect || '/dashboard');
        }
      } catch (err) {
        setError(true);
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Google sign-in could not be completed</h2>
          <p className="text-slate-500">There was an issue authenticating your account. Please try again.</p>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-5 font-bold transition-colors">
              Try again
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-3 px-5 font-bold transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <div className="bg-slate-100 p-4 rounded-full">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Signing you in...</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please wait while we finish setting up your account.</p>
        </div>
      </div>
    </div>
  );
}
