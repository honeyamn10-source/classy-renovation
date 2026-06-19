import * as React from 'react';

export function Switch(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input type="checkbox" className={className ?? 'h-5 w-5 rounded border-ink-300 text-gold-500 focus:ring-gold-400'} {...rest} />;
}
