'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';

interface GlobalMetrics {
  projectsCount: number;
  openTickets: number;
  closedTickets: number;
}

interface ProjectMetrics {
  projectId: number;
  name: string;
  openTickets: number;
  closedTickets: number;
}

interface CompanyMetrics {
  companyId: number;
  name: string;
  projectsCount: number;
  openTickets: number;
  closedTickets: number;
  projects: ProjectMetrics[];
}

interface AdminMetricsDto {
  global: GlobalMetrics;
  companies: CompanyMetrics[];
}

export default function AdminMetrics() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [metrics, setMetrics] = useState<AdminMetricsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
        const res = await fetch(`${apiUrl}/api/admin/metrics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="text-gray-400 p-8 text-center animate-pulse">Loading metrics...</div>;
  if (error) return <div className="text-red-400 p-8 text-center">{error}</div>;
  if (!metrics) return null;

  return (
    <div className="space-y-8">
      {/* Global Metrics */}
      <div>
        <h3 className="text-xl font-display font-semibold text-white mb-4">{t('admin.globalMetrics')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-primary mb-2">{metrics.global.projectsCount}</span>
            <span className="text-sm font-medium text-gray-400">{t('admin.totalProjects')}</span>
          </div>
          <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-action mb-2">{metrics.global.openTickets}</span>
            <span className="text-sm font-medium text-gray-400">{t('admin.totalOpenTickets')}</span>
          </div>
          <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-green-500 mb-2">{metrics.global.closedTickets}</span>
            <span className="text-sm font-medium text-gray-400">{t('admin.totalClosedTickets')}</span>
          </div>
        </div>
      </div>

      {/* Per Company Metrics */}
      <div>
        <h3 className="text-xl font-display font-semibold text-white mb-4">{t('admin.companyMetrics')}</h3>
        <div className="space-y-6">
          {metrics.companies.map((comp) => (
            <div key={comp.companyId} className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="font-medium text-white text-lg">{comp.name}</h4>
                  <p className="text-xs text-gray-500">ID: {comp.companyId}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-primary">{comp.projectsCount}</span>
                    <span className="text-xs text-gray-400">Projects</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-action">{comp.openTickets}</span>
                    <span className="text-xs text-gray-400">Open</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-green-500">{comp.closedTickets}</span>
                    <span className="text-xs text-gray-400">Closed</span>
                  </div>
                </div>
              </div>

              {/* Projects List */}
              {comp.projects.length > 0 && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Projects</h5>
                  {comp.projects.map(proj => (
                    <div key={proj.projectId} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                      <span className="text-sm text-gray-200">{proj.name}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-action">{proj.openTickets} Open</span>
                        <span className="text-green-500">{proj.closedTickets} Closed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {metrics.companies.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No companies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
