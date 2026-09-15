# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| master  | :white_check_mark: |

Security fixes are applied to the latest commit on `master`. This application is in development — do not use it for sensitive production data without validation.

## Reporting a vulnerability

Please **do not open a public issue** for security vulnerabilities.

Email the maintainer privately with the subject `[classy-renovation] Security` and include:

- Description of the vulnerability and potential impact
- Affected endpoint or module
- Reproduction steps (fictional test data only — never receipts, customer, or business data)
- Suggested fix, if known

You will receive an acknowledgement within 5 business days and a remediation plan or a written explanation if the finding is not a vulnerability.

## What we take seriously

- PIN / JWT session handling and session records
- Receipt upload pipeline and OCR job isolation
- Encryption of stored secrets and sensitive values
- Audit logs and duplicate-detection guarantees
- Supabase bucket access control and least-privilege keys

## Deployment guidance

- Apply migrations and validate login, uploads, receipt processing and reports against a test database before any production use.
- Rotate and restrict `JWT_SECRET`, `ENCRYPTION_KEY`, and cloud provider keys.