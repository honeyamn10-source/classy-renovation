import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[110px] w-full rounded-3xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm transition placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500',
        className
      )}
      {...props}
    />
  );
});
