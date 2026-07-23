import { Ticket } from '@/hooks/useTickets';

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  selectedTicketId: number | null;
  onSelectTicket: (id: number) => void;
}

export default function TicketList({ tickets, loading, selectedTicketId, onSelectTicket }: TicketListProps) {
  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500 font-medium">No tickets found.</p>
        <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
      </div>
    );
  }

  const TICKET_STATUS_COLORS: Record<string, string> = {
    'OPEN': 'bg-action/10 text-action border-action/20',
    'CLOSED': 'bg-success/10 text-success border-success/20',
    'DEFAULT': 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
  };

  const getStatusColor = (status: string) => {
    return TICKET_STATUS_COLORS[status] || TICKET_STATUS_COLORS['DEFAULT'];
  };


  return (
    <div className="flex-1 p-4 space-y-3">
      {tickets.map(t => (
        <div 
          key={t.id} 
          onClick={() => onSelectTicket(t.id)}
          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group ${
            selectedTicketId === t.id 
              ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/5' 
              : 'border-transparent bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-semibold text-sm ${selectedTicketId === t.id ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
              #{t.id} - {t.type}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${getStatusColor(t.status)}`}>
              {t.status}
            </span>
          </div>
          <p className={`text-sm line-clamp-2 ${selectedTicketId === t.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
            {t.description}
          </p>
        </div>
      ))}
    </div>
  );
}
