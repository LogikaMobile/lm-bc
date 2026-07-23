import { useState, useEffect } from 'react';

export interface Ticket {
  id: number;
  projectId: number;
  type: string;
  status: string;
  priority: string;
  description: string;
  serviceHours?: number;
  startedAt?: string;
  closedAt?: string;
  createdAt: string;
}

export function useTickets(token: string | null, page: number, limit: number) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const offset = page * limit;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
        const res = await fetch(`${apiUrl}/api/tickets?limit=${limit}&offset=${offset}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (e) {
        console.error('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, token, limit]);

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const offset = page * limit;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/tickets?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      console.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id: number, data: Partial<Ticket>) => {
    if (!token) return false;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await refresh();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update ticket', e);
      return false;
    }
  };

  return { tickets, loading, refresh, updateTicket };
}
