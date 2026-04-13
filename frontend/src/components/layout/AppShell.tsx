import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/classNames';

export function AppShell() {
  const { isAuthenticated } = useAuthStore();
  const { devToolsOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      {isAuthenticated && <Sidebar />}
      <main className={cn(
        'transition-all pt-0',
        isAuthenticated ? 'lg:ml-56' : '',
        devToolsOpen ? 'mr-80' : ''
      )}>
        <Outlet />
      </main>
    </div>
  );
}
