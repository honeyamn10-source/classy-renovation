import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const logs = await db.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 25, include: { user: true } });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security & Operations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['JWT auth', 'Rate limiting', 'File validation', 'Audit logging'].map((item) => (
            <div key={item} className="rounded-3xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-800/60">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
              <div className="font-semibold">{log.action}</div>
              <div className="text-sm text-ink-500">{log.user.name} · {new Date(log.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
