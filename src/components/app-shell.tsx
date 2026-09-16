import Image from 'next/image';
import Link from 'next/link';
import { Menu, LayoutDashboard, ReceiptText, WalletCards, FileText, Sparkles, Landmark, BarChart3, Users, ShieldCheck, Settings2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ReceiptText },
  { href: '/cards', label: 'Cards', icon: WalletCards },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/insights', label: 'AI Insights', icon: Sparkles },
  { href: '/tax', label: 'Tax Center', icon: Landmark },
  { href: '/vendors', label: 'Vendors', icon: BarChart3 },
  { href: '/monthly-summary', label: 'Monthly Summary', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings2 }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(215,154,18,0.18),_transparent_30%),linear-gradient(180deg,#f6f3ec_0%,#ece7db_100%)] text-ink-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(215,154,18,0.14),_transparent_30%),linear-gradient(180deg,#12100d_0%,#1a1713_100%)] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-72 border-r border-ink-200/80 bg-white/80 p-6 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 pb-8">
            <Image src="/brand-logo.svg" alt="Classy Renovations" width={220} height={60} priority />
          </div>
          <div className="mb-8 rounded-3xl border border-gold-200 bg-gold-50 p-4 text-sm text-ink-700 dark:border-gold-900/40 dark:bg-gold-950/30 dark:text-gold-100">
            <div className="font-semibold text-ink-900 dark:text-white">Signed in as {user?.user.name ?? 'Partner'}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gold-700">Classy Renovations Inc</div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                >
                  <Icon className="h-4 w-4 text-gold-500" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-8">
            <Button variant="outline" className="w-full justify-start rounded-2xl">
              <ShieldCheck className="h-4 w-4" />
              Activity logs protected
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-ink-200/70 bg-white/70 px-4 py-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/60 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <Menu className="h-5 w-5" />
                <Image src="/brand-logo.svg" alt="Classy Renovations" width={180} height={48} />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm uppercase tracking-[0.22em] text-gold-700">Business Expense Manager</div>
                <div className="font-serif text-2xl text-ink-900 dark:text-white">Classy Renovations Inc</div>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-600 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200">
                  {user?.user.name ?? 'Partner'}
                </div>
                <form action="/api/auth/logout" method="post">
                  <Button type="submit" variant="secondary" size="sm">
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </header>
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
