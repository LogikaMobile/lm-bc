import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface ChatMessage {
  status?: string;
  error?: string;
  message?: string;
  senderId?: number;
  senderName?: string;
  timestamp?: string;
}

export function useTicketSocket(ticketId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!ticketId || !token) return;

    // Clear previous messages when connecting to a new ticket
    setMessages([]);

    // Connect to WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8090';
    const ws = new WebSocket(`${wsUrl}/ws/tickets/${ticketId}/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      // Send token immediately as the first payload as per rules
      ws.send(JSON.stringify({ token }));
    };

    ws.onmessage = (event) => {
      if (ws !== wsRef.current) return;
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'connected') {
          setConnected(true);
          setError(null); // Clear any previous errors on successful connection
        } else if (data.message) {
          // Compare the senderId to our own user ID from the auth store
          const isMe = data.senderId === user?.id;
          setMessages((prev) => {
            // Prevent duplicate messages if reconnecting by checking if message with same timestamp & content exists
            const isDuplicate = prev.some(m => m.message === data.message && m.timestamp === data.timestamp);
            if (isDuplicate) return prev;
            return [...prev, { ...data, status: isMe ? 'sent' : 'received' }];
          });
        } else if (data.error) {
          setError(data.error);
        }
      } catch (e) {
        console.error("Failed to parse message", e);
      }
    };

    ws.onerror = (e) => {
      if (ws !== wsRef.current) return;
      console.error("WebSocket Error Event:", e);
      setError("WebSocket Error");
    };

    ws.onclose = (event) => {
      if (ws !== wsRef.current) return;
      setConnected(false);
      if (event.code === 1008) {
        setError("Policy Violation: Invalid token or timeout");
      }
    };

    // Strict cleanup function to prevent memory leaks and ghost connections
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [ticketId, token, reconnectTrigger]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
    }
  };

  const reconnect = () => {
    setReconnectTrigger(prev => prev + 1);
  };

  return { messages, connected, error, sendMessage, reconnect };
}
