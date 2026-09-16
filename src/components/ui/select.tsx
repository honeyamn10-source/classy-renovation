import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select
      className={cn(
        'h-11 w-full rounded-full border border-ink-200 bg-white px-4 text-sm text-ink-900 shadow-sm transition focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-white',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
