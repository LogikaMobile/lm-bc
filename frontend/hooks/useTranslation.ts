'use client';

import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const dictionaries: Record<string, any> = {
  en,
  es
};

export function useTranslation() {
  const [lang, setLang] = useState('es');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (dictionaries[browserLang]) {
      setLang(browserLang);
    } else {
      setLang('en');
    }
  }, []);

  const t = (key: string, options?: { fallback?: string }) => {
    const keys = key.split('.');
    let result = dictionaries[lang];
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return options?.fallback || key; // Fallback to key if missing
      }
    }
    return result as string;
  };

  return { t, lang };
}
