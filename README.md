<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs><text x="0" y="140" font-size="80" font-weight="900" fill="url(#g)" font-family="system-ui,-apple-system,sans-serif">privora</text></svg>

Privacy-first form platform. Build surveys, elections, and feedback forms with configurable trust controls — anonymous responses, IP protection, submission limits, and data retention policies built in.

**Trust by design.**

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&style=flat-square)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&style=flat-square)
![CI/CD](https://img.shields.io/badge/DevSecOps-Pipeline-6366f1?style=flat-square)

---

## Features

- **7 question types** — short text, long text, multiple choice, checkboxes, dropdown, rating, matrix
- **Trust Score** — visual badge ranks forms by privacy (0–5 scale)
- **Configurable privacy** — anonymity level, IP storage, submission limits, retention period, visibility
- **Duplicate detection** — hash-based submission tokens prevent double-voting
- **CSV export** — download response data for any form
- **Auth** — email/password, magic link, Google, GitHub (via Supabase Auth)
- **Pricing tiers** — Starter (free), Club, Institution with usage limits
- **Form modes** — Survey & Election modes

## Tech Stack

| Layer          | Choice                                           |
| -------------- | ------------------------------------------------ |
| **Framework**  | Next.js 14 (App Router, React Server Components) |
| **Language**   | TypeScript 5.4                                   |
| **Styling**    | Tailwind CSS 3.4                                 |
| **Auth & DB**  | Supabase (PostgreSQL, Auth, RLS)                 |
| **Validation** | Zod                                              |
| **State**      | Zustand                                          |
| **Deploy**     | Netlify                                          |
| **CI/CD**      | GitHub Actions                                   |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Netlify](https://netlify.com) account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/luckyman147/privora.git
cd privora
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

| Variable                               | Description                               |
| -------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Your Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable (anon) key      |
| `NEXT_PUBLIC_SITE_URL`                 | App URL (`http://localhost:3000` for dev) |

### 3. Run Database Migrations

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates the `profiles`, `forms`, `responses`, and `submission_tokens` tables with Row-Level Security and auto-profile triggers.

### 4. Enable Auth Providers

In your Supabase Dashboard → **Authentication → Providers**, enable:

- Email/Password
- Magic Link (email OTP)
- Google
- GitHub

If you want magic links to go out through Gmail, configure **Authentication → SMTP** in Supabase with a Gmail address and a Google App Password. Do not use your normal Gmail password.

Use the branded email template in [supabase/auth/magic-link-template.html](supabase/auth/magic-link-template.html) for the Supabase magic-link message. It uses `{{ .ConfirmationURL }}` and `{{ .SiteURL }}` so the same link and logo work in local and production environments.

For Google/GitHub, you'll need OAuth app credentials from their developer consoles. Set the redirect URL to:

```
https://your-site.netlify.app/auth/callback
```

### 5. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account, then build your first form!

## Project Structure

```
privora/
├── .github/workflows/     # CI/CD — lint, typecheck, test, security audit,
│   ├── ci.yml             #   Snyk scan, CodeQL, DB migration, Netlify deploy
│   └── dependabot.yml     # Automated dependency updates
│
├── supabase/
│   ├── config.toml        # Supabase CLI configuration
│   └── migrations/        # Database migrations (PostgreSQL + RLS)
│
├── src/
│   ├── app/
│   │   ├── auth/          # Sign in, sign up, magic link, OAuth callback
│   │   ├── builder/       # Form builder (3-column layout)
│   │   ├── dashboard/     # Form list, create/delete/duplicate
│   │   ├── form/          # Public form view + submission endpoint
│   │   ├── pricing/       # Pricing tiers page
│   │   ├── results/       # Response table + CSV export
│   │   └── page.tsx       # Landing page
│   │
│   ├── components/
│   │   ├── FormBuilder/   # QuestionCanvas, QuestionPanel, SettingsPanel
│   │   ├── TrustScore/    # TrustScoreCard, TrustScoreBadge, TrustScoreConfig
│   │   └── ui/            # Reusable Button, Input, Badge
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Server Supabase client + helpers
│   │   ├── supabase-browser.ts  # Browser Supabase client
│   │   ├── types.ts             # TypeScript interfaces + plan limits
│   │   └── utils.ts             # cn(), hashToken(), responsesToCSV(), etc.
│   │
│   └── middleware.ts      # Auth guard for protected routes
│
├── netlify.toml           # Netlify build config + security headers
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## CI/CD Pipeline

Every push to `main` triggers an automated pipeline:

```
Lint → Typecheck → Test → npm Audit → Snyk Scan → CodeQL Analysis → DB Migrate → Build → Deploy
```

| Job                  | Tool              | Description                        |
| -------------------- | ----------------- | ---------------------------------- |
| **lint**             | `next lint`       | ESLint with Next.js config         |
| **typecheck**        | `tsc --noEmit`    | Full TypeScript check              |
| **test**             | `vitest`          | Unit tests                         |
| **security-audit**   | `npm audit`       | High-severity dependency check     |
| **snyk-scan**        | Snyk CLI          | Open-source vulnerability scanning |
| **codeql-analysis**  | GitHub CodeQL     | Semantic code analysis             |
| **db-migrate**       | Supabase CLI      | Push SQL migrations to Supabase    |
| **build-and-deploy** | Next.js + Netlify | Production build + deploy          |

### Required GitHub Secrets

| Secret                  | Purpose                        |
| ----------------------- | ------------------------------ |
| `SNYK_TOKEN`            | Snyk API token (free tier)     |
| `NETLIFY_AUTH_TOKEN`    | Netlify personal access token  |
| `NETLIFY_SITE_ID`       | Netlify site API ID            |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token |
| `SUPABASE_PROJECT_ID`   | Supabase project reference     |

## Database Schema

### `profiles`

Stores user organization info. Auto-created on signup via a trigger on `auth.users`.

| Column       | Type        | Notes                              |
| ------------ | ----------- | ---------------------------------- |
| `id`         | UUID        | PK, references `auth.users`        |
| `org_name`   | TEXT        | Organization name                  |
| `plan`       | TEXT        | `starter` / `club` / `institution` |
| `created_at` | TIMESTAMPTZ | Auto-generated                     |

### `forms`

The core entity — each form has a dynamic `questions` (JSON array) and `trust_config` (JSON object).

| Column         | Type        | Notes                         |
| -------------- | ----------- | ----------------------------- |
| `id`           | UUID        | PK, auto-generated            |
| `owner_id`     | UUID        | FK → `profiles.id`            |
| `title`        | TEXT        | Form title                    |
| `description`  | TEXT        | Optional                      |
| `mode`         | TEXT        | `survey` or `election`        |
| `trust_config` | JSONB       | Privacy settings              |
| `questions`    | JSONB       | Question definitions          |
| `status`       | TEXT        | `draft` / `active` / `closed` |
| `closes_at`    | TIMESTAMPTZ | Optional closing time         |

### `responses`

Stores form submissions.

| Column         | Type        | Notes                        |
| -------------- | ----------- | ---------------------------- |
| `id`           | UUID        | PK                           |
| `form_id`      | UUID        | FK → `forms.id`              |
| `answers`      | JSONB       | Question ID → answer mapping |
| `submitted_at` | TIMESTAMPTZ | Auto-generated               |

### `submission_tokens`

Prevents duplicate submissions. Stores a hash of `formId:userSeed`.

| Column       | Type        | Notes           |
| ------------ | ----------- | --------------- |
| `hash`       | TEXT        | PK              |
| `form_id`    | UUID        | FK → `forms.id` |
| `created_at` | TIMESTAMPTZ | Auto-generated  |

## Trust Score System

Each form has a configurable **Trust Configuration** that determines its privacy level:

| Setting              | Options                         | Trust Points        |
| -------------------- | ------------------------------- | ------------------- |
| **Visibility**       | Creator only / Org / Public     | +1 for creator_only |
| **Identity**         | Anonymous / Optional / Required | +1 for anonymous    |
| **IP Storage**       | Not stored / Hashed / Stored    | +1 for not stored   |
| **Submission Limit** | 1 per person / Unlimited        | +1 for 1 per person |
| **Retention**        | 30 / 90 / 180 / 365 days        | +1 for ≤90 days     |

**Score interpretation:**

- **5/5** — 🟢 Full privacy (recommended for elections and sensitive surveys)
- **3–4/5** — 🟡 Moderate privacy
- **0–2/5** — 🔴 Low privacy

## Security

- **Row-Level Security** — all tables are RLS-protected
- **CSP Headers** — Content Security Policy set via `netlify.toml`
- **HSTS** — HTTP Strict Transport Security enforced
- **Input Validation** — Zod schemas on all server actions
- **Duplicate Detection** — SHA-256 hash tokens prevent double-voting
- **Dependency Audits** — Automated npm + Snyk scanning in CI

## License

[MIT](LICENSE)
