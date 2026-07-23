'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface Ticket {
  id: number;
  projectId: number;
  type: string;
  status: string;
  priority: string;
  description: string;
  createdAt: string;
}

interface TicketBoardProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: number) => void;
}

const COLUMNS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
};

const TYPE_COLORS: Record<string, string> = {
  BUG: 'text-red-600 dark:text-red-400',
  FEATURE: 'text-blue-600 dark:text-blue-400',
  SUPPORT: 'text-purple-600 dark:text-purple-400'
};

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import EditTicketModal from './admin/EditTicketModal';
import { useTickets } from '@/hooks/useTickets';

export default function TicketBoard({ tickets, onSelectTicket }: TicketBoardProps) {
  const { t } = useTranslation();
  const { company, token } = useAuthStore();
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const { updateTicket } = useTickets(token, 0, 10); // We just need updateTicket method

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'OPEN': return t('tickets.status.open', { fallback: 'Abierto' });
      case 'IN_PROGRESS': return t('tickets.status.in_progress', { fallback: 'En Progreso' });
      case 'RESOLVED': return t('tickets.status.resolved', { fallback: 'Resuelto' });
      case 'CLOSED': return t('tickets.status.closed', { fallback: 'Cerrado' });
      default: return status;
    }
  };

  return (
    <div className="flex-1 w-full overflow-x-auto custom-scrollbar p-6 relative">
      <div className="flex gap-6 min-w-max h-full">
        {COLUMNS.map(status => {
          const columnTickets = tickets.filter(t => t.status === status);
          
          return (
            <div key={status} className="w-80 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-display font-bold text-gray-800 dark:text-gray-100 text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/80"></span>
                  {getColumnTitle(status)}
                </h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  {columnTickets.length}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {columnTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className="glass-panel p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border border-white/40 dark:border-white/10 relative group rounded-xl bg-white/50 dark:bg-black/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                          #{ticket.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {company?.type === 'INTERNAL' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingTicket(ticket as any); }}
                              className="text-gray-500 hover:text-blue-500 transition-colors"
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS['LOW']}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className={`text-sm font-bold mb-2 ${TYPE_COLORS[ticket.type] || 'text-gray-700 dark:text-gray-300'}`}>
                        {ticket.type}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed cursor-pointer" onClick={() => onSelectTicket(ticket.id)}>
                        {ticket.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <button onClick={() => onSelectTicket(ticket.id)} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold cursor-pointer z-20">
                          <span>Ver Chat</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnTickets.length === 0 && (
                  <div className="h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700/50 flex items-center justify-center text-sm text-gray-400 font-medium">
                    Sin tickets
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket as any}
          isOpen={true}
          onClose={() => setEditingTicket(null)}
          onSave={async (id, data) => {
            const success = await updateTicket(id, data);
            if (success) {
              window.location.reload(); // Quick fix to refresh tickets array
            }
          }}
        />
      )}
    </div>
  );
}
