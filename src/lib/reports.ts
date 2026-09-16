import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export type SummaryRow = {
  label: string;
  value: number;
};

export type ReportPayload = {
  title: string;
  subtitle: string;
  rows: SummaryRow[];
  totals: Record<string, number>;
};

export function buildMonthlyReportPayload(params: {
  monthName: string;
  total: number;
  partnerTotals: Record<string, number>;
  categoryTotals: Record<string, number>;
  taxTotal: number;
}) {
  return {
    title: `${params.monthName} Business Expense Report`,
    subtitle: 'Classy Renovations Inc',
    rows: Object.entries(params.categoryTotals).map(([label, value]) => ({ label, value })),
    totals: {
      total: params.total,
      tax: params.taxTotal,
      ...params.partnerTotals
    }
  } satisfies ReportPayload;
}

export async function renderReportPdf(payload: ReportPayload) {
  const doc = new PDFDocument({ margin: 48, size: 'A4' });
  const chunks: Buffer[] = [];

  return await new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).fillColor('#12100d').text(payload.title);
    doc.moveDown(0.2).fontSize(11).fillColor('#6b6455').text(payload.subtitle);
    doc.moveDown(1);

    Object.entries(payload.totals).forEach(([label, value]) => {
      doc.fontSize(12).fillColor('#12100d').text(`${label}: $${value.toFixed(2)}`);
    });

    doc.moveDown(1);
    doc.fontSize(14).text('Category Breakdown');
    payload.rows.forEach((row) => {
      doc.fontSize(11).text(`${row.label}: $${row.value.toFixed(2)}`);
    });

    doc.end();
  });
}

export async function renderReportExcel(payload: ReportPayload) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');

  sheet.columns = [
    { header: 'Label', key: 'label', width: 24 },
    { header: 'Value', key: 'value', width: 16 }
  ];

  sheet.addRow({ label: payload.title, value: '' });
  sheet.addRow({ label: payload.subtitle, value: '' });
  sheet.addRow({ label: 'Totals', value: '' });

  Object.entries(payload.totals).forEach(([label, value]) => {
    sheet.addRow({ label, value });
  });

  sheet.addRow({ label: 'Categories', value: '' });
  payload.rows.forEach((row) => {
    sheet.addRow(row);
  });

  return workbook.xlsx.writeBuffer();
}

export function formatReportMonth(date = new Date()) {
  return format(date, 'MMMM yyyy');
}
