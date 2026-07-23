'use client';

import { useActionState, useEffect } from 'react';
import { loginAction } from '@/app/actions/authActions';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginPage() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.data) {
      login(state.data.token, state.data.user, state.data.company);
      router.push('/dashboard');
    }
  }, [state, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center mesh-bg relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-action/15 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md p-10 space-y-8 glass-panel border-t-[3px] border-t-action z-10 mx-4">
        
        <div className="flex flex-col items-center">
          <Link href="/" className="hover:scale-105 transition-transform cursor-pointer">
            <Image src="/LM_BC.svg" alt="LogikaMobile Logo" width={320} height={320} className="w-80 h-80 object-contain drop-shadow-2xl" />
          </Link>
        </div>
        
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('login.email')}</label>
            <input 
              name="email" 
              type="email" 
              placeholder="name@company.com"
              required 
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-action focus:border-transparent dark:text-white transition-all outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('login.password')}</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-action focus:border-transparent dark:text-white transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-100/80 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400 animate-pulse">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full px-4 py-3.5 font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('login.authenticating')}
              </span>
            ) : t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}
