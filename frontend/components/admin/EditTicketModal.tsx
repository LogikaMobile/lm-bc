import React, { useState } from 'react';
import { Ticket } from '@/hooks/useTickets';

interface EditTicketModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Ticket>) => Promise<void>;
}

export default function EditTicketModal({ ticket, isOpen, onClose, onSave }: EditTicketModalProps) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [type, setType] = useState(ticket.type);
  const [description, setDescription] = useState(ticket.description);
  const [serviceHours, setServiceHours] = useState<number | ''>(ticket.serviceHours ?? '');
  const [startedAt, setStartedAt] = useState(ticket.startedAt ? new Date(ticket.startedAt).toISOString().slice(0, 16) : '');
  const [closedAt, setClosedAt] = useState(ticket.closedAt ? new Date(ticket.closedAt).toISOString().slice(0, 16) : '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(ticket.id, {
        status,
        priority,
        type,
        description,
        serviceHours: serviceHours === '' ? undefined : Number(serviceHours),
        startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
        closedAt: closedAt ? new Date(closedAt).toISOString() : undefined
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Ticket #{ticket.id}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="OPEN">Abierto</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="BLOCKED">Bloqueado</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridad</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="SUPPORT">Soporte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Horas de Servicio</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={serviceHours}
                onChange={(e) => setServiceHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="datetime-local"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
              <input
                type="datetime-local"
                value={closedAt}
                onChange={(e) => setClosedAt(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[100px]"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
