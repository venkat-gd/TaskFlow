import { create } from 'zustand';

interface UiState {
  isDark: boolean;
  sidebarOpen: boolean;
  devToolsOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleDevTools: () => void;
}

function getInitialDarkMode(): boolean {
  const stored = localStorage.getItem('taskflow-dark-mode');
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const useUiStore = create<UiState>((set) => ({
  isDark: getInitialDarkMode(),
  sidebarOpen: true,
  devToolsOpen: false,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem('taskflow-dark-mode', String(next));
      document.documentElement.classList.toggle('dark', next);
      return { isDark: next };
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDevTools: () => set((state) => ({ devToolsOpen: !state.devToolsOpen })),
}));
