# Classy Renovations Business Expense Manager

A business expense platform for receipt capture, card-based spending analysis, and monthly reporting.

**Stage:** In development. External OCR, storage, and reporting integrations require configuration and deployment validation.

Built with Next.js, TypeScript, PostgreSQL, and a background receipt-processing workflow.

## Features

- PIN login for two business partners
- Receipt and invoice uploads with OCR and AI extraction
- Partner and card ownership tracking
- Executive dashboards and charts
- Branded PDF, Excel, and CSV reporting
- Tax center, vendor analytics, monthly summaries, and AI insights
- Audit logs, duplicate receipt detection, and background job architecture

## Stack

- Next.js 15, TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- JWT auth with session records
- BullMQ + Redis background jobs
- OpenAI, Google Vision, AWS Textract adapters
- PDFKit, ExcelJS, Recharts

## Local setup

1. Install dependencies with `npm ci`, then copy `.env.example` to `.env` and configure your development services and secrets.
2. Run Prisma generation and migration:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

## Docker

Run the full stack:

```bash
docker compose up --build
```

## Production environment variables

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `AUTH_ISSUER`
- `APP_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_VISION_PROJECT_ID`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_BUCKET`
- `ENCRYPTION_KEY`

## Routes

- `/login`
- `/dashboard`
- `/expenses`
- `/cards`
- `/reports`
- `/insights`
- `/tax`
- `/vendors`
- `/monthly-summary`
- `/settings`

## API

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/analytics`
- `GET /api/cards`
- `POST /api/cards`
- `GET /api/expenses`
- `GET /api/expenses/:id`
- `PATCH /api/expenses/:id`
- `POST /api/upload/receipt`
- `GET /api/reports`
- `GET /api/health`
