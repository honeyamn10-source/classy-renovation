import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });
const displayFont = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Classy Renovations Business Expense Manager',
  description: 'AI-powered business expense management for renovation companies.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
