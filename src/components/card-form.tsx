'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function CardForm({ users }: { users: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setPending(false);
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Business and personal payment methods</CardDescription>
        <CardTitle>Add card</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input name="cardName" placeholder="Business Visa" required />
          <Input name="bank" placeholder="TD" required />
          <Select name="type" defaultValue="credit">
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Select>
          <Select name="ownership" defaultValue="business">
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </Select>
          <Select name="ownerId" defaultValue={users[0]?.id}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
          <Input name="last4" placeholder="1234" maxLength={4} required />
          <Input name="color" placeholder="#d79a12" className="md:col-span-2" />
          <Button className="md:col-span-2" type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Add card'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
