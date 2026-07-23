'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { company } = useAuthStore();

  useEffect(() => {
    if (company) {
      if (company.primaryColor) {
        document.documentElement.style.setProperty('--theme-primary', company.primaryColor);
      }
      if (company.secondaryColor) {
        document.documentElement.style.setProperty('--theme-secondary', company.secondaryColor);
      }
    } else {
      // Revert to defaults if not logged in
      document.documentElement.style.removeProperty('--theme-primary');
      document.documentElement.style.removeProperty('--theme-secondary');
    }
  }, [company]);

  return <>{children}</>;
}
