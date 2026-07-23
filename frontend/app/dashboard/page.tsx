'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TicketChat from '@/components/TicketChat';
import TicketList from '@/components/TicketList';
import TicketPagination from '@/components/TicketPagination';
import AdminPanel from '@/components/admin/AdminPanel';
import CreateTicketModal from '@/app/[locale]/dashboard/components/CreateTicketModal';
import TicketBoard from '@/components/TicketBoard';
import { useTickets } from '@/hooks/useTickets';
import { useTranslation } from '@/hooks/useTranslation';

const LIMIT = 10;

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, company, token, logout } = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'board'>('split');
  
  const { tickets, loading, refresh } = useTickets(token, page, LIMIT);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!user || !company || !token) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleTicketCreated = () => {
    setIsCreateModalOpen(false);
    refresh();
  };

  const renderTicketsContent = () => {
    if (viewMode === 'board') {
      return (
        <div className="glass-panel w-full h-[600px] lg:h-[calc(100vh-140px)] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-black/20 flex justify-between items-center">
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {t('dashboard.tickets')}
            </h2>
            <div className="flex gap-4 items-center">
              <div className="flex bg-gray-200 dark:bg-gray-800 rounded-md p-1">
                <button onClick={() => setViewMode('split')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`}>Lista</button>
                <button onClick={() => setViewMode('board')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-white dark:bg-gray-600 shadow-sm text-primary`}>Tablero</button>
              </div>
              {company.type === 'CLIENT' && (
                <button onClick={() => setIsCreateModalOpen(true)} className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                  + {t('ticketModal.title')}
                </button>
              )}
            </div>
          </div>
          <TicketBoard 
            tickets={tickets} 
            onSelectTicket={(id) => {
              setSelectedTicketId(id);
              setViewMode('split');
            }} 
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
        {/* Left Column: Tickets List */}
        <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col glass-panel overflow-hidden h-[600px] lg:h-[calc(100vh-140px)]">
          <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-black/20 flex justify-between items-center">
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {t('dashboard.tickets')}
            </h2>
            <div className="flex gap-2 items-center">
              <div className="flex bg-gray-200 dark:bg-gray-800 rounded-md p-1 mr-2">
                <button onClick={() => setViewMode('split')} className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-md transition-colors bg-white dark:bg-gray-600 shadow-sm text-primary`}>Lista</button>
                <button onClick={() => setViewMode('board')} className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-md transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`}>Tablero</button>
              </div>
              {company.type === 'CLIENT' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                >
                  +
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <TicketList 
              tickets={tickets} 
              loading={loading} 
              selectedTicketId={selectedTicketId} 
              onSelectTicket={setSelectedTicketId} 
            />
          </div>

          <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-black/30">
            <TicketPagination 
              page={page} 
              hasMore={tickets.length === LIMIT} 
              onPrev={() => setPage(p => Math.max(0, p - 1))} 
              onNext={() => setPage(p => p + 1)} 
            />
          </div>
        </div>

        {/* Right Column: Ticket Chat */}
        <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col glass-panel overflow-hidden h-[600px] lg:h-[calc(100vh-140px)]">
          {selectedTicketId ? (
             <TicketChat ticket={tickets.find(t => t.id === selectedTicketId) as any} />
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white/20 dark:bg-black/10">
               <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </div>
               <h3 className="text-xl font-display font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.noTicketSelected')}</h3>
               <p className="mt-2 text-sm text-center max-w-sm">{t('dashboard.noTicketDesc')}</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen mesh-bg bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/20 dark:to-secondary/20 relative overflow-hidden">
      
      {/* Branded Navbar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary/20 to-transparent backdrop-blur-xl border-b border-primary/30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="hover:scale-105 transition-transform flex items-center justify-center">
              {company.logoPath ? (
                <img src={company.logoPath.startsWith('http') ? company.logoPath : `/${company.logoPath}`} alt={`${company.name} Logo`} width={80} height={80} className="w-20 h-20 object-contain drop-shadow-md" />
              ) : (
                <Image src="/LM_NBG.svg" alt="LogikaMobile Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-md" />
              )}
            </div>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {company.type === 'INTERNAL' ? (
                <><span className="text-action drop-shadow-sm">Logika</span><span className="text-primary drop-shadow-sm">Mobile</span> <span className="font-light opacity-80 text-gray-900 dark:text-white text-xl hidden sm:inline">{t('navbar.businessCenter')}</span></>
              ) : (
                <span className="text-primary drop-shadow-sm">{company.name}</span>
              )}
            </h1>
            <p className="text-xs text-primary font-medium opacity-80">{company.type} {t('navbar.account')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 border-l border-gray-300 dark:border-gray-700 pl-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <button onClick={handleLogout} className="text-gray-500 hover:text-action transition-colors text-xs">{t('navbar.signOut')}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {company.type === 'INTERNAL' ? (
          <AdminPanel ticketsNode={renderTicketsContent()} />
        ) : (
          renderTicketsContent()
        )}
      </main>
      
      {isCreateModalOpen && (
        <CreateTicketModal
          token={token}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleTicketCreated}
        />
      )}

      {/* Decorative Orbs */}
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
    </div>
  );
}
