'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function UploadForm({ users }: { users: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/upload/receipt', {
      method: 'POST',
      body: formData
    });

    const payload = await response.json().catch(() => null);
    setPending(false);

    if (!response.ok) {
      setMessage(payload?.message ?? 'Upload failed');
      return;
    }

    setMessage(payload?.duplicate ? 'Duplicate receipt detected and linked.' : 'Receipt processed successfully.');
    router.refresh();
    event.currentTarget.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>AI receipt processing</CardDescription>
        <CardTitle>Upload receipt or invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Receipt file</label>
            <input type="file" name="file" accept="image/*,application/pdf" required className="block w-full text-sm" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Uploaded by</label>
              <Select name="uploadedById" defaultValue={users[0]?.id}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expense owner</label>
              <Select name="expenseOwnerId" defaultValue={users[0]?.id}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea name="notes" placeholder="Project, site, or job notes" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? 'Processing...' : 'Process receipt'}
          </Button>
          {message ? <div className="rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-700 dark:bg-ink-800 dark:text-ink-200">{message}</div> : null}
        </form>
      </CardContent>
    </Card>
  );
}
