import { cn } from '@/utils/classNames';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6',
        variant === 'glass'
          ? 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20'
          : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
