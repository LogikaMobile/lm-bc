'use client';

import { useState } from 'react';
import { useTicketSocket } from '@/hooks/useTicketSocket';
import { useAuthStore } from '@/store/authStore';
import { Ticket } from '@/hooks/useTickets';
import EditTicketModal from './admin/EditTicketModal';
import { useTickets } from '@/hooks/useTickets';

export default function TicketChat({ ticket }: { ticket: Ticket }) {
  const { messages, connected, error, sendMessage, reconnect } = useTicketSocket(ticket.id);
  const [input, setInput] = useState('');
  const { company, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const { updateTicket } = useTickets(token, 0, 10);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && connected) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-primary">Chat - Ticket #{ticket.id}</h3>
          {company?.type === 'INTERNAL' && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              title="Editar Ticket"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        {connected ? (
          <span className="text-xs px-2 py-1 rounded-full bg-success text-white">
            Connected
          </span>
        ) : (
          <button 
            onClick={reconnect} 
            className="text-xs px-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1 cursor-pointer"
            title="Click to reconnect"
          >
            Disconnected ↻
          </button>
        )}
      </div>

      {isEditing && (
        <EditTicketModal
          ticket={ticket}
          isOpen={true}
          onClose={() => setIsEditing(false)}
          onSave={async (id, data) => {
            const success = await updateTicket(id, data);
            if (success) {
              window.location.reload();
            }
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        {messages.map((m, idx) => {
          const date = m.timestamp ? new Date(m.timestamp) : new Date();
          const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isMe = m.status === 'sent';

          return (
          <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
              <div className="flex items-center gap-2 mb-1 justify-between">
                <span className="text-[10px] opacity-70 font-medium">
                  {isMe ? 'Tú' : (m.senderName || 'Desconocido')} &bull; {timeString}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
            </div>
          </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
          className="flex-1 px-4 py-2 border rounded-md focus:ring-action focus:border-action dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button 
          type="submit"
          disabled={!connected || !input.trim()}
          className="px-4 py-2 bg-action text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
