import { AppShell } from '@/components/app-shell';

// Business data must be loaded for the current request, never during a build.
export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
