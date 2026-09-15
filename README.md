<p align="center">
  <img src="https://github.com/honeyamn10-source/honeyamn10-source/raw/main/assets/classy-renovation.svg" alt="Classy Renovations" width="100%" />
</p>

<h1 align="center">Classy Renovations — Business Expense Manager</h1>

<p align="center">
  <b>Receipt capture, AI extraction, and monthly reporting for hands-on operators.</b>
  <br />
  <em>Expense management built around real paperwork: take a photo of a receipt, and the right line lands in the right report.</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/next.js-15-000000.svg" alt="Next.js 15"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-5-3178C6.svg" alt="TypeScript"></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/prisma-5-2D3748.svg" alt="Prisma"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/postgresql-16-336791.svg" alt="PostgreSQL"></a>
</p>

<p align="center">
  <a href="https://github.com/honeyamn10-source/classy-renovation/blob/master/docs/"><img src="https://img.shields.io/badge/docs-in%20development-important.svg" alt="Stage: In development"></a>
</p>

---

A business expense platform for receipt capture, card-based spending analysis, and monthly reporting — built for renovation and contracting businesses that live on physical receipts and spreadsheets.

> **Stage:** In development. External OCR, storage, and reporting integrations require configuration and deployment validation.

## ✨ Features

- 🔐 **PIN login** for two business partners
- 🧾 **Receipt & invoice uploads** with OCR and AI extraction
- 💳 **Partner and card ownership tracking**
- 📊 **Executive dashboards** and charts
- 📄 **Branded PDF, Excel, and CSV reporting**
- 🧾 **Tax center**, vendor analytics, monthly summaries, and AI insights
- 🕵️ **Audit logs**, duplicate receipt detection, and background job architecture

## 🧱 Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Backend | Next.js API routes, JWT auth with session records |
| Data | Prisma + PostgreSQL, Redis |
| Jobs | BullMQ — background receipt-processing pipeline |
| AI / OCR | OpenAI, Google Vision, and AWS Textract adapters |
| Reports | PDFKit, ExcelJS |

## 🚀 Local setup

1. Install dependencies and configure environment:

```bash
npm ci
cp .env.example .env
```

2. Generate Prisma client, run migrations, and seed:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

3. Start the app:

```bash
npm run dev
```

## 🐳 Docker

Run the full stack (PostgreSQL + Redis + app):

```bash
docker compose up --build
```

The Next.js build generates the standalone server expected by the `Dockerfile`. Before a customer deployment, configure the services and secrets listed below, apply migrations, and validate login, uploads, receipt processing, and reports against a test database.

> GitHub Actions validates the server build; it does not deploy the app. GitHub Pages cannot run an authenticated API or a receipt worker.

## 🔑 Production environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` · `DIRECT_URL` | PostgreSQL connection strings |
| `JWT_SECRET` · `AUTH_ISSUER` · `APP_URL` | Authentication |
| `REDIS_URL` | Background job queue |
| `OPENAI_API_KEY` · `OPENAI_MODEL` | AI extraction adapter |
| `GOOGLE_APPLICATION_CREDENTIALS` · `GOOGLE_VISION_PROJECT_ID` | Google Vision adapter |
| `AWS_REGION` · `AWS_ACCESS_KEY_ID` · `AWS_SECRET_ACCESS_KEY` | AWS Textract adapter |
| `SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` · `SUPABASE_BUCKET` | Object storage |
| `ENCRYPTION_KEY` | At-rest encryption for sensitive data |

## 🧭 Routes

| Route | Purpose |
| --- | --- |
| `/login` | Partner authentication |
| `/dashboard` | Executive overview |
| `/expenses` | Expense management |
| `/cards` | Card & ownership tracking |
| `/reports` | Branded reporting |
| `/insights` · `/tax` · `/vendors` · `/monthly-summary` | Analysis surfaces |
| `/settings` | Configuration |

## 🌐 API

| Endpoint | Purpose |
| --- | --- |
| `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/session` | Session management |
| `GET /api/analytics` | Dashboard analytics |
| `GET/POST /api/cards` | Card management |
| `GET /api/expenses` · `GET/PATCH /api/expenses/:id` | Expense records |
| `POST /api/upload/receipt` | Receipt ingestion |
| `GET /api/reports` | Report generation |
| `GET /api/health` | Health check |

## 🛡️ Security

- JWT authentication with session records, no default credentials
- Receipt storage keys kept out of client code
- Encryption at rest for sensitive values
- See [SECURITY.md](SECURITY.md) for the vulnerability policy

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

## 📄 License

[MIT](LICENSE) © 2026 [Bittu Sharma](https://github.com/honeyamn10-source)