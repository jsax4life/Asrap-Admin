import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export const useTheme = () => {
  const {
    theme,
    systemTheme,
    setTheme,
    toggleTheme,
    setSystemTheme,
    initializeTheme,
  } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return {
    theme,
    systemTheme,
    setTheme,
    toggleTheme,
    setSystemTheme,
  };
};
