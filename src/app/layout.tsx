import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import './globals.css';
import { Toaster } from 'sonner';

const fontVariables = {
  '--font-body': 'Manrope, system-ui, sans-serif',
  '--font-display': '"Cormorant Garamond", Georgia, serif'
} as CSSProperties;

export const metadata: Metadata = {
  title: 'Classy Renovations Business Expense Manager',
  description: 'AI-powered business expense management for renovation companies.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={fontVariables}>
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
