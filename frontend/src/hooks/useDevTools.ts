import { useDevToolsStore } from '@/store/devToolsStore';
import { useUiStore } from '@/store/uiStore';

export function useDevTools() {
  const devTools = useDevToolsStore();
  const { devToolsOpen, toggleDevTools } = useUiStore();

  return {
    ...devTools,
    isOpen: devToolsOpen,
    toggle: toggleDevTools,
  };
}
