import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

export function useTheme() {
  const { isDark, toggleDarkMode } = useUiStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return { isDark, toggleDarkMode };
}
