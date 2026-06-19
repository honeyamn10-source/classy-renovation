import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-gold-300/60 bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-800 dark:border-gold-700/60 dark:bg-gold-950 dark:text-gold-200',
        className
      )}
      {...props}
    />
  );
}
