import { renderHook, act } from '@testing-library/react';
import { useTicketSocket } from './useTicketSocket';

// Mock zustand store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(() => ({ token: 'fake-token', user: { id: 1 } }))
}));

describe('useTicketSocket', () => {
  let mockWebSocket: any;

  beforeEach(() => {
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      readyState: 1, // WebSocket.OPEN
    };
    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    // Explicitly add OPEN and CONNECTING constants to global WebSocket for cleanup check
    (global as any).WebSocket.OPEN = 1;
    (global as any).WebSocket.CONNECTING = 0;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty messages and disconnected state', () => {
    const { result } = renderHook(() => useTicketSocket(null));
    expect(result.current.messages).toEqual([]);
    expect(result.current.connected).toBe(false);
  });

  it('should attempt to connect when ticketId is provided', () => {
    renderHook(() => useTicketSocket(1));
    
    expect(global.WebSocket).toHaveBeenCalledWith(
      expect.stringContaining('/ws/tickets/1/chat')
    );
  });

  it('should send token on open', () => {
    renderHook(() => useTicketSocket(1));
    
    act(() => {
      mockWebSocket.onopen();
    });
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ token: 'fake-token' }));
  });

  it('should update connected when WebSocket receives connected status and closes', () => {
    const { result } = renderHook(() => useTicketSocket(1));
    
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify({ status: 'connected' }) });
    });
    expect(result.current.connected).toBe(true);

    act(() => {
      mockWebSocket.onclose({ code: 1000 });
    });
    expect(result.current.connected).toBe(false);
  });

  it('should append incoming messages', () => {
    const { result } = renderHook(() => useTicketSocket(1));
    
    const fakeMessage = { message: 'Hello', senderId: 2, timestamp: '10:00' };
    
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(fakeMessage) });
    });
    
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].message).toBe('Hello');
  });

  it('should send a message via WebSocket', () => {
    const { result } = renderHook(() => useTicketSocket(1));
    
    act(() => {
      result.current.sendMessage('New test message');
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ message: 'New test message' }));
  });
});
