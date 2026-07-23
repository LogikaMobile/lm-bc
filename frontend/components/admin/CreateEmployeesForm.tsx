'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';

interface EmployeeInput {
  name: string;
  email: string;
}

export default function CreateEmployeesForm() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [companies, setCompanies] = useState<{id: number, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [employees, setEmployees] = useState<EmployeeInput[]>([{ name: '', email: '' }]);
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
          setCompanies(data.companies.map((c: any) => ({ id: c.companyId, name: c.name })));
        }
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    };
    fetchCompanies();
  }, [token]);

  const addEmployeeRow = () => {
    setEmployees([...employees, { name: '', email: '' }]);
  };

  const updateEmployee = (index: number, field: keyof EmployeeInput, value: string) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value;
    setEmployees(newEmployees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      setStatus({ type: 'error', message: t('admin.selectCompany') });
      return;
    }

    try {
      const payload = employees.map(emp => ({
        name: emp.name,
        email: emp.email,
        companyId: parseInt(selectedCompanyId, 10)
      }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/admin/users/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create employees');
      
      setStatus({ type: 'success', message: t('admin.successEmployees') });
      setEmployees([{ name: '', email: '' }]);
      setSelectedCompanyId('');
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

      <div className="space-y-4 border-t border-gray-800 pt-4">
        {employees.map((emp, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">{t('admin.employeeName')}</label>
              <input
                type="text"
                required
                value={emp.name}
                onChange={(e) => updateEmployee(idx, 'name', e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">{t('admin.employeeEmail')}</label>
              <input
                type="email"
                required
                value={emp.email}
                onChange={(e) => updateEmployee(idx, 'email', e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEmployeeRow}
        className="text-action hover:text-action/80 text-sm font-medium"
      >
        + {t('admin.addEmployee')}
      </button>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/30"
      >
        {t('admin.submitEmployees')}
      </button>
    </form>
  );
}
