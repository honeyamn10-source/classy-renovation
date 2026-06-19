'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: String(formData.get('userId')),
        pin: String(formData.get('pin')),
        rememberDevice: formData.get('rememberDevice') === 'on'
      })
    });

    setPending(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: 'Login failed' }));
      setError(payload.message ?? 'Login failed');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-gold-200/60 bg-white/90 shadow-luxe dark:border-gold-900/40 dark:bg-ink-900/90">
      <CardHeader>
        <CardDescription>PIN login for partner access</CardDescription>
        <CardTitle>Enter the business vault</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Partner</label>
            <Select name="userId" defaultValue="Parget">
              <option value="Parget">Parget</option>
              <option value="Rajan">Rajan</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">PIN</label>
            <Input name="pin" type="password" inputMode="numeric" maxLength={4} pattern="[0-9]{4}" placeholder="1111" required />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-ink-200 px-4 py-3 text-sm dark:border-ink-700">
            <Switch name="rememberDevice" />
            Remember this device for 30 days
          </label>
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Signing in...' : 'Login with PIN'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
