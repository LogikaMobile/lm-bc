'use client';

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 min-h-screen mesh-bg relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="w-full absolute top-0 left-0 z-50 p-6 flex justify-between items-center glass border-b-0 rounded-none shadow-none">
        <div className="flex items-center gap-3">

          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="text-action">Logika</span><span className="text-primary">Mobile</span> <span className="font-light opacity-60 text-gray-900 dark:text-white text-xl">| Business Center</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium rounded-full bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
            {t('navbar.signIn')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 relative z-10 text-center mt-20">
        
        {/* Animated Badge */}
        <div className="mb-8 rounded-3xl glass border border-primary/20 bg-primary/5 animate-fade-in-up overflow-hidden flex items-center justify-center">
          <Image src="/LM_BC.svg" alt="LM_BC" width={300} height={300} className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto" />
        </div>

        {/* Main Headline */}
        <h1 className="font-display max-w-5xl text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-action">
            {t('landing.headline')}
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 font-sans leading-relaxed">
          {t('landing.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
          >
            {t('landing.accessPortal')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link 
            href="/docs" 
            className="flex items-center justify-center h-14 px-8 rounded-full glass font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all hover:scale-105"
          >
            {t('landing.readDocs')}
          </Link>
        </div>
      </main>
      
      {/* Decorative Blur Circles in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-action/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
