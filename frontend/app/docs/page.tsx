import Link from 'next/link';
import Image from 'next/image';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen mesh-bg relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-action/20 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 p-6 flex justify-between items-center glass border-b border-white/20 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="bg-black p-3 rounded-xl shadow-md hover:scale-105 transition-transform border border-gray-800">
              <Image src="/LM_NBG.svg" alt="LogikaMobile Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            </div>
          </Link>
          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="text-action">Logika</span><span className="text-primary">Mobile</span> <span className="font-light opacity-60 text-gray-900 dark:text-white text-xl hidden sm:inline">| Documentation</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium rounded-full bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 relative z-10">
        <div className="glass-panel p-10 mt-10">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">LogikaMobile API & Integration Docs</h1>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>Welcome to the official LogikaMobile documentation center.</p>
            <p className="mt-4 p-4 bg-action/10 border border-action/20 rounded-lg text-action">
              [Placeholder for documentation content to be provided by user]
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
