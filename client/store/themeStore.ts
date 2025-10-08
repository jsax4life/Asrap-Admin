import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState } from '@/types';
import { THEME_CONFIG } from '@/constants';

interface ThemeStore extends ThemeState {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: THEME_CONFIG.defaultTheme as 'light' | 'dark',
      systemTheme: false,

      // Actions
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme, systemTheme: false });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme, systemTheme: false });
        applyTheme(newTheme);
      },

      setSystemTheme: (useSystem: boolean) => {
        set({ systemTheme: useSystem });
        
        if (useSystem) {
          const systemTheme = getSystemTheme();
          set({ theme: systemTheme });
          applyTheme(systemTheme);
        }
      },

      initializeTheme: () => {
        const { systemTheme, theme } = get();
        
        if (systemTheme) {
          const systemThemeValue = getSystemTheme();
          set({ theme: systemThemeValue });
          applyTheme(systemThemeValue);
        } else {
          applyTheme(theme);
        }
      },
    }),
    {
      name: THEME_CONFIG.storageKey,
    }
  )
);

// Helper functions
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { systemTheme } = useThemeStore.getState();
    
    if (systemTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      useThemeStore.getState().setTheme(newTheme);
    }
  });
}
