import { getEnv } from '@/lib/env';

export type OCRExtraction = {
  vendor: string;
  date: string | null;
  time: string | null;
  address: string | null;
  phone: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: string;
  items: Array<{ name: string; amount: number }>;
  confidence: number;
  rawText: string;
};

export async function extractOCRText(buffer: Buffer, mimeType: string) {
  const env = getEnv();

  if (env.GOOGLE_APPLICATION_CREDENTIALS || env.GOOGLE_VISION_PROJECT_ID) {
    const vision = await import('@google-cloud/vision');
    const client = new vision.v1.ImageAnnotatorClient();
    if (mimeType === 'application/pdf') {
      const [result] = await client.documentTextDetection({ image: { content: buffer } });
      return result.fullTextAnnotation?.text ?? '';
    }
    const [result] = await client.textDetection({ image: { content: buffer } });
    return result.textAnnotations?.[0]?.description ?? '';
  }

  const text = buffer.toString('utf8');
  return text;
}

export async function extractWithAI(rawText: string, vendorHint?: string) {
  const env = getEnv();

  if (env.OPENAI_API_KEY) {
    const { OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: 'system',
          content:
            'Extract structured receipt data from OCR text. Return concise JSON with vendor, date, time, address, phone, subtotal, tax, total, currency, items, and confidence.'
        },
        {
          role: 'user',
          content: `OCR text:\n${rawText}\nVendor hint: ${vendorHint ?? 'unknown'}`
        }
      ]
    });

    const content = response.output_text ?? '{}';
    return JSON.parse(content) as Partial<OCRExtraction>;
  }

  const vendor = vendorHint ?? rawText.split('\n').find(Boolean)?.trim() ?? 'Unknown vendor';
  const subtotalMatch = rawText.match(/subtotal[^\d]*(\d+[\d,.]*)/i);
  const taxMatch = rawText.match(/(?:gst|hst|tax)[^\d]*(\d+[\d,.]*)/i);
  const totalMatch = rawText.match(/total[^\d]*(\d+[\d,.]*)/i);
  const amount = (value: string | null) => (value ? Number(value.replace(/,/g, '')) : null);

  return {
    vendor,
    date: null,
    time: null,
    address: null,
    phone: null,
    subtotal: amount(subtotalMatch?.[1] ?? null),
    tax: amount(taxMatch?.[1] ?? null),
    total: amount(totalMatch?.[1] ?? null),
    currency: 'CAD',
    items: [],
    confidence: 0.55,
    rawText
  } satisfies OCRExtraction;
}
