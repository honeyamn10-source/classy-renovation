![Classy Renovations](docs/assets/cover.svg)

# Classy Renovations

<!-- repo-badges:start -->
<div align="center">

[![Stars](https://img.shields.io/github/stars/honeyamn10-source/classy-renovation?style=flat-square&logo=github&label=Stars)](https://github.com/honeyamn10-source/classy-renovation/stargazers)
[![Forks](https://img.shields.io/github/forks/honeyamn10-source/classy-renovation?style=flat-square&logo=github&label=Forks)](https://github.com/honeyamn10-source/classy-renovation/forks)
[![Issues](https://img.shields.io/github/issues/honeyamn10-source/classy-renovation?style=flat-square&logo=github&label=Issues)](https://github.com/honeyamn10-source/classy-renovation/issues)
[![Last Commit](https://img.shields.io/github/last-commit/honeyamn10-source/classy-renovation?style=flat-square&logo=github&label=Last%20Commit)](https://github.com/honeyamn10-source/classy-renovation/commits/master)

[Repository](https://github.com/honeyamn10-source/classy-renovation) · [Issues](https://github.com/honeyamn10-source/classy-renovation/issues) · [Pull Requests](https://github.com/honeyamn10-source/classy-renovation/pulls) · [Actions](https://github.com/honeyamn10-source/classy-renovation/actions)

</div>
<!-- repo-badges:end -->

<!-- professional-meta:start -->
<div align="center">

[![ci](https://github.com/honeyamn10-source/classy-renovation/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/honeyamn10-source/classy-renovation/actions/workflows/ci.yml) [![codeql](https://github.com/honeyamn10-source/classy-renovation/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/honeyamn10-source/classy-renovation/actions/workflows/codeql.yml)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=white)

[Documentation](docs) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Changelog](CHANGELOG.md) · [Live Demo](https://honeyamn10-source.github.io/classy-renovation/)

</div>
<!-- professional-meta:end -->




An expense-management app for a renovation business: track costs, review receipts, manage vendors and prepare reports.

[Project website](https://honeyamn10-source.github.io/classy-renovation/) · [Build results](https://github.com/honeyamn10-source/classy-renovation/actions)

## What it does

- **Capture receipts.** Upload receipt images and configure OCR processing.
- **Review expenses.** Keep expense details, vendors, cards and partner views together.
- **Prepare reports.** Use the dashboard, analytics and report routes to inspect stored costs.

## Start from source

Node.js, PostgreSQL and Redis. Copy .env.example to .env and replace placeholder secrets. Run npm run worker separately for queued receipt processing.

```bash
git clone https://github.com/honeyamn10-source/classy-renovation.git
cd classy-renovation
npm ci
npm run prisma:generate
# Configure .env and start PostgreSQL + Redis first
npm run prisma:migrate
npm run seed
npm run dev
```

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```

## Scope

This website is a project guide. The expense app requires a Node server and database. OCR, storage and model providers need separate configuration and live verification.

## Find your way around

- [Configuration](.env.example)
- [Data model](prisma/schema.prisma)
- [Receipt worker](src/workers/receipt-worker.ts)

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). Include a minimal reproduction and runtime versions with bug reports; remove credentials from logs.

MIT — see [LICENSE](LICENSE). Third-party dependencies retain their applicable licenses.
