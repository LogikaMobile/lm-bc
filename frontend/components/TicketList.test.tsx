import { render, screen, fireEvent } from '@testing-library/react';
import TicketList from './TicketList';

describe('TicketList', () => {
  it('renders loading state', () => {
    const { container } = render(
      <TicketList tickets={[]} loading={true} selectedTicketId={null} onSelectTicket={() => {}} />
    );
    expect(container.getElementsByClassName('animate-pulse').length).toBe(3);
  });

  it('renders empty state', () => {
    render(
      <TicketList tickets={[]} loading={false} selectedTicketId={null} onSelectTicket={() => {}} />
    );
    expect(screen.getByText('No tickets found.')).toBeInTheDocument();
  });

  it('renders list of tickets', () => {
    const tickets = [
      { id: 1, type: 'APP', status: 'OPEN', priority: 'NORMAL', description: 'Test app bug', companyId: 1, projectId: 1, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: 2, type: 'WEB', status: 'CLOSED', priority: 'NORMAL', description: 'Test web feature', companyId: 1, projectId: 1, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    
    render(
      <TicketList tickets={tickets} loading={false} selectedTicketId={null} onSelectTicket={() => {}} />
    );
    
    expect(screen.getByText('#1 - APP')).toBeInTheDocument();
    expect(screen.getByText('Test app bug')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    
    expect(screen.getByText('#2 - WEB')).toBeInTheDocument();
    expect(screen.getByText('CLOSED')).toBeInTheDocument();
  });

  it('calls onSelectTicket when a ticket is clicked', () => {
    const tickets = [
      { id: 1, type: 'APP', status: 'OPEN', priority: 'NORMAL', description: 'Test app bug', companyId: 1, projectId: 1, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    const handleSelect = jest.fn();
    
    render(
      <TicketList tickets={tickets} loading={false} selectedTicketId={null} onSelectTicket={handleSelect} />
    );
    
    fireEvent.click(screen.getByText('#1 - APP'));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });
});
