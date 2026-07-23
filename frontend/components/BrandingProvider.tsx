'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function BrandingProvider({ children }: { children: React.ReactNode }) {
  const company = useAuthStore((state) => state.company);

  useEffect(() => {
    if (company) {
      if (company.primaryColor) {
        document.documentElement.style.setProperty('--theme-primary', company.primaryColor);
      } else {
        document.documentElement.style.removeProperty('--theme-primary');
      }

      if (company.secondaryColor) {
        document.documentElement.style.setProperty('--theme-secondary', company.secondaryColor);
      } else {
        document.documentElement.style.removeProperty('--theme-secondary');
      }

      if (company.accentColor) {
        document.documentElement.style.setProperty('--theme-action', company.accentColor);
      } else {
        document.documentElement.style.removeProperty('--theme-action');
      }
    } else {
      document.documentElement.style.removeProperty('--theme-primary');
      document.documentElement.style.removeProperty('--theme-secondary');
      document.documentElement.style.removeProperty('--theme-action');
    }
  }, [company]);

  return <>{children}</>;
}
