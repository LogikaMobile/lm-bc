'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';

export default function CreateProjectForm() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [companies, setCompanies] = useState<{id: number, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
        const res = await fetch(`${apiUrl}/api/admin/metrics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Solo filtramos si hay alguna regla de negocio, por ahora traemos todas.
          setCompanies(data.companies.map((c: any) => ({ id: c.companyId, name: c.name })));
        }
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    };
    fetchCompanies();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      setStatus({ type: 'error', message: t('admin.selectCompany') });
      return;
    }
    if (!projectName.trim()) {
      setStatus({ type: 'error', message: t('admin.projectName') + ' is required' });
      return;
    }
    if (!projectType) {
      setStatus({ type: 'error', message: t('admin.projectType') + ' is required' });
      return;
    }

    try {
      const payload = {
        name: projectName.trim(),
        companyId: parseInt(selectedCompanyId, 10),
        type: projectType
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/admin/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      setStatus({ type: 'success', message: t('admin.successProject') });
      setProjectName('');
      setSelectedCompanyId('');
      setProjectType('');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.message && (
        <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.selectCompany')}</label>
        <select 
          required
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all mb-2 appearance-none cursor-pointer"
        >
          <option value="" disabled className="text-gray-500">Seleccione una empresa...</option>
          {companies.map(comp => (
            <option key={comp.id} value={comp.id} className="bg-gray-900">
              {comp.name} (ID: {comp.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.projectName')}</label>
        <input
          type="text"
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.projectType')}</label>
        <select 
          required
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all mb-2 appearance-none cursor-pointer"
        >
          <option value="" disabled className="text-gray-500">Seleccione el tipo de proyecto...</option>
          <option value="LMAAS" className="bg-gray-900">LMaaS</option>
          <option value="SAAS" className="bg-gray-900">SaaS</option>
          <option value="VENTA_UNICA" className="bg-gray-900">Venta única de código</option>
          <option value="HAAS" className="bg-gray-900">HaaS</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/30"
      >
        {t('admin.submitProject')}
      </button>
    </form>
  );
}
