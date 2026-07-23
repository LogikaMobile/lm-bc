'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface Company {
  id: number;
  name: string;
  type: string;
  supportHoursQuota: number;
  isActive: boolean;
}

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = useAuthStore(s => s.token);

  const fetchCompanies = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/admin/companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/admin/companies/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-gray-400">Loading companies...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Empresas Existentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 rounded-tr-lg text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              const COMPANY_TYPE_COLORS: Record<string, string> = {
                'INTERNAL': 'bg-purple-900/50 text-purple-300',
                'DEFAULT': 'bg-blue-900/50 text-blue-300'
              };
              
              const COMPANY_STATUS_STYLES = {
                true: { label: 'Activa', colors: 'bg-green-900/50 text-green-300', btnColors: 'bg-red-500/10 text-red-400 hover:bg-red-500/20', btnLabel: 'Desactivar' },
                false: { label: 'Inactiva', colors: 'bg-red-900/50 text-red-300', btnColors: 'bg-green-500/10 text-green-400 hover:bg-green-500/20', btnLabel: 'Activar' }
              };
              
              const typeColor = COMPANY_TYPE_COLORS[c.type] || COMPANY_TYPE_COLORS['DEFAULT'];
              const statusStyle = COMPANY_STATUS_STYLES[c.isActive as unknown as keyof typeof COMPANY_STATUS_STYLES];

              return (
              <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3">#{c.id}</td>
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${typeColor}`}>
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusStyle.colors}`}>
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleStatus(c.id, c.isActive)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${statusStyle.btnColors}`}
                  >
                    {statusStyle.btnLabel}
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
