import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyList from './CompanyList';
import { useAuthStore } from '@/store/authStore';

// Mock zustand store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn()
}));

describe('CompanyList', () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue('fake-token');
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<CompanyList />);
    expect(screen.getByText('Loading companies...')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false
    });
    
    render(<CompanyList />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch companies')).toBeInTheDocument();
    });
  });

  it('renders list of companies successfully', async () => {
    const mockCompanies = [
      { id: 1, name: 'Company A', type: 'CLIENT', supportHoursQuota: 10, isActive: true },
      { id: 2, name: 'Company B', type: 'INTERNAL', supportHoursQuota: 50, isActive: false }
    ];
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockCompanies
    });
    
    render(<CompanyList />);
    
    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Company B')).toBeInTheDocument();
    expect(screen.getByText('CLIENT')).toBeInTheDocument();
    expect(screen.getByText('INTERNAL')).toBeInTheDocument();
    expect(screen.getByText('Activa')).toBeInTheDocument();
    expect(screen.getByText('Inactiva')).toBeInTheDocument();
  });

  it('toggles company status when action button is clicked', async () => {
    const mockCompanies = [
      { id: 1, name: 'Company A', type: 'CLIENT', supportHoursQuota: 10, isActive: true }
    ];
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ // First call for GET companies
        ok: true,
        json: async () => mockCompanies
      })
      .mockResolvedValueOnce({ // Second call for PUT status
        ok: true
      });
      
    window.alert = jest.fn();
    
    render(<CompanyList />);
    
    await waitFor(() => {
      expect(screen.getByText('Desactivar')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Desactivar'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/companies/1/status'),
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ isActive: false }) })
      );
    });
    
    // UI should update to show Activar
    await waitFor(() => {
      expect(screen.getByText('Activar')).toBeInTheDocument();
    });
  });
});
