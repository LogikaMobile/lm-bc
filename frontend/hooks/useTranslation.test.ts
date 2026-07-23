import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';

describe('useTranslation', () => {
  beforeEach(() => {
    // Reset document language before each test
    document.documentElement.lang = 'en';
  });

  it('should return default language and translation function', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.lang).toBe('en');
    expect(typeof result.current.t).toBe('function');
  });

  it('should translate known keys correctly', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('login.signIn')).toBe('Sign In');
  });

  it('should return the key if translation is missing', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('unknown.key.does.not.exist')).toBe('unknown.key.does.not.exist');
  });

});
