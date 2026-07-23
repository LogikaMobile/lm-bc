'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';

export default function CreateCompanyForm() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('CLIENT');
  const [supportHoursQuota, setSupportHoursQuota] = useState<number | string>(10);
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [logoPath, setLogoPath] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
      const res = await fetch(`${apiUrl}/api/admin/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name, 
          type, 
          supportHoursQuota,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          accentColor: accentColor || null,
          logoPath: logoPath || null
        })
      });

      if (!res.ok) throw new Error('Failed to create company');
      
      setStatus({ type: 'success', message: t('admin.successCompany') });
      setName('');
      setType('CLIENT');
      setSupportHoursQuota('40');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.message && (
        <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.companyName')}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.companyType')}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
        >
          <option value="CLIENT">Client</option>
          <option value="PROVIDER">Provider</option>
          <option value="INTERNAL">Internal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.supportHours')}</label>
        <input
          type="number"
          min="0"
          required
          value={supportHoursQuota}
          onChange={(e) => setSupportHoursQuota(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.primaryColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor || '#000000'}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#FFFFFF"
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.secondaryColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={secondaryColor || '#000000'}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              placeholder="#FFFFFF"
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.accentColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={accentColor || '#000000'}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-10 h-10 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#FFFFFF"
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors uppercase"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.logoFile')}</label>
        <input
          type="text"
          value={logoPath}
          onChange={(e) => setLogoPath(e.target.value)}
          placeholder="logo.svg"
          className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-action hover:bg-action/90 text-white rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-action/30"
      >
        {t('admin.submitCompany')}
      </button>
    </form>
  );
}
