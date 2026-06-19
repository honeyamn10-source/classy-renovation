import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function ExpensesTable({ expenses }: { expenses: Array<any> }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Card Used</TableHead>
              <TableHead>Business/Personal</TableHead>
              <TableHead>Uploaded By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link className="font-semibold text-ink-900 hover:text-gold-700 dark:text-white" href={`/expenses/${expense.id}`}>
                    {expense.vendor}
                  </Link>
                  <div className="text-xs text-ink-500">{expense.receiptExists ? 'Receipt attached' : 'No receipt'}</div>
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>${expense.tax.toFixed(2)}</TableCell>
                <TableCell>{expense.paidBy}</TableCell>
                <TableCell>{expense.cardUsed}</TableCell>
                <TableCell>
                  <Badge>{expense.ownership}</Badge>
                </TableCell>
                <TableCell>{expense.uploadedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
