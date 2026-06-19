import { NextRequest, NextResponse } from 'next/server';
import { ReportFormat, ReportType } from '@prisma/client';
import { getAuthFromRequest } from '@/lib/request-auth';
import { formatReportMonth, buildMonthlyReportPayload, renderReportPdf, renderReportExcel } from '@/lib/reports';
import { getDashboardSnapshot } from '@/lib/dashboard';
import { db } from '@/lib/db';
import { getInsightNarrative } from '@/lib/insights';

function csvEscape(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const type = (url.searchParams.get('type') ?? 'monthly') as ReportType;
  const format = (url.searchParams.get('format') ?? 'pdf') as ReportFormat;
  const now = new Date();
  const year = Number(url.searchParams.get('year') ?? now.getFullYear());
  const month = Number(url.searchParams.get('month') ?? now.getMonth() + 1);

  const snapshot = await getDashboardSnapshot();
  const payload = buildMonthlyReportPayload({
    monthName: formatReportMonth(new Date(year, month - 1, 1)),
    total: snapshot.metrics.totalThisMonth,
    partnerTotals: {
      Parget: snapshot.metrics.pargetSpend,
      Rajan: snapshot.metrics.rajanSpend
    },
    categoryTotals: Object.fromEntries(snapshot.series.categories.map((row) => [row.name, row.amount])),
    taxTotal: snapshot.metrics.taxPaid
  });

  const fileName = `${type}-${format}-${year}-${String(month).padStart(2, '0')}`;
  const report = await db.report.create({
    data: {
      type,
      format,
      periodStart: new Date(year, month - 1, 1),
      periodEnd: new Date(year, month, 0),
      generatedById: auth.user.id,
      data: { payload, insights: await getInsightNarrative() }
    }
  });

  if (format === 'pdf') {
    const buffer = await renderReportPdf(payload);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}.pdf"`
      }
    });
  }

  if (format === 'excel') {
    const buffer = await renderReportExcel(payload);
    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}.xlsx"`
      }
    });
  }

  const rows = [
    ['Report', payload.title],
    ['Subtitle', payload.subtitle],
    ...Object.entries(payload.totals).map(([key, value]) => [key, String(value)]),
    ...payload.rows.map((row) => [row.label, String(row.value)])
  ];
  const csv = rows.map(([a, b]) => `${csvEscape(a ?? '')},${csvEscape(b ?? '')}`).join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}.csv"`
    }
  });
}
