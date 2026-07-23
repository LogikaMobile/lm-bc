'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import CreateCompanyForm from './CreateCompanyForm';
import CreateEmployeesForm from './CreateEmployeesForm';
import CreateProjectForm from './CreateProjectForm';
import AdminMetrics from './AdminMetrics';
import CompanyList from './CompanyList';

interface AdminPanelProps {
  ticketsNode: React.ReactNode;
}

export default function AdminPanel({ ticketsNode }: AdminPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'metrics' | 'tickets' | 'projects' | 'companies' | 'employees'>('metrics');

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-display font-bold text-white mb-6">
          {t('admin.title')}
        </h2>

        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'text-action border-b-2 border-action'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t('admin.metricsTab')}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'text-action border-b-2 border-action'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t('admin.ticketsTab')}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'projects'
                ? 'text-action border-b-2 border-action'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t('admin.projectsTab')}
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'companies'
                ? 'text-action border-b-2 border-action'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t('admin.companiesTab')}
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'employees'
                ? 'text-action border-b-2 border-action'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t('admin.employeesTab')}
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'metrics' && <AdminMetrics />}
          {activeTab === 'tickets' && ticketsNode}
          {activeTab === 'projects' && <CreateProjectForm />}
          {activeTab === 'companies' && (
            <div className="space-y-8">
              <CreateCompanyForm />
              <div className="border-t border-gray-800 pt-8 mt-8">
                <CompanyList />
              </div>
            </div>
          )}
          {activeTab === 'employees' && <CreateEmployeesForm />}
        </div>
      </div>
    </div>
  );
}
